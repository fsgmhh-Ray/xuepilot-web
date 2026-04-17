import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse
from supabase import create_client, Client

# ==============================================================================
# XuePilot OER Spider (V7.0 English K-12 Empire - 纯英文中小学全量收割版)
# 核心使命：精准打击纯英文小学(Elementary)及中学(Middle School)的开源教科书
# ==========================================

# ✅ 您的 Supabase 链接与 Service Role Key
SUPABASE_URL = "https://cywslfalbedraeeggryj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA0ODk2MSwiZXhwIjoyMDkxNjI0OTYxfQ.zKrF72r5DTVzQhdTQNmYPpQf5DSDkdGW4bMxZx739qo" 

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class XuePilotK12Spider:
    def __init__(self):
        # 伪装成真实的浏览器
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
        }

    # ==========================================================================
    # 🎯 战略目标 1：Wikijunior (维基儿童教科书) - 专为 8-11 岁小学阶段打造
    # ==========================================================================
    def harvest_wikijunior(self):
        print("\n" + "="*50)
        print(" 🚀 [K-6 小学目标] 启动 Wikijunior 儿童教科书收割协议...")
        print("="*50)

        # Wikijunior 纯英文小学科学与人文教科书
        books = [
            ("tb_wj_solar_system", "Wikijunior: Solar System (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Solar_System", "🪐"),
            ("tb_wj_human_body", "Wikijunior: Human Body (K-6 Biology)", "https://en.wikibooks.org/wiki/Wikijunior:Human_Body", "🧬"),
            ("tb_wj_dinosaurs", "Wikijunior: Dinosaurs (K-6 History)", "https://en.wikibooks.org/wiki/Wikijunior:Dinosaurs", "🦖"),
            ("tb_wj_biology", "Wikijunior: Biology (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Biology", "🌱")
        ]

        for book_id, title, url, icon in books:
            # 检查断点续传
            try:
                existing = supabase.table("edu_textbooks").select("code_id").eq("code_id", book_id).execute()
                if existing.data:
                    print(f"  ⏭️ [跳过] 《{title}》已入库。")
                    continue
            except:
                pass

            print(f"\n  ⏳ 正在解析小学教材目录: 《{title}》...")
            
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.text, 'html.parser')
                
                # 寻找目录链接 (Wikibooks 的子页面通常以主书名为前缀)
                base_path = urlparse(url).path
                chapter_urls = []
                
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    # 如果链接是这本书的子页面，并且不是编辑页、讨论页
                    if href.startswith(base_path + '/') and ':' not in href.replace(base_path, ''):
                        full_url = urljoin(url, href)
                        if full_url not in chapter_urls:
                            chapter_urls.append(full_url)

                if not chapter_urls:
                    print("  ❌ 未找到章节列表。")
                    continue
                
                print(f"  🎯 嗅探到 {len(chapter_urls)} 个科普章节，开始抓取图文...")
                
                chapters_data = []
                for idx, chap_url in enumerate(chapter_urls):
                    if idx % 5 == 0 and idx > 0:
                        print(f"    ...已提取 {idx}/{len(chapter_urls)} 章...")
                        
                    c_res = requests.get(chap_url, headers=self.headers, timeout=10)
                    c_soup = BeautifulSoup(c_res.text, 'html.parser')
                    
                    # 提取正文内容区
                    content_div = c_soup.find('div', class_='mw-parser-output')
                    if not content_container:
                        continue
                        
                    # 提取标题
                    title_h1 = c_soup.find('h1', id='firstHeading')
                    chap_title = title_h1.get_text(strip=True).split('/')[-1].replace('_', ' ') if title_h1 else f"Chapter {idx+1}"

                    # 清洗无用的 Wiki 元素 (导航框、编辑按钮等)
                    for el in content_div.find_all(['table', 'div'], class_=['navbox', 'infobox', 'noprint']):
                        el.decompose()
                    for el in content_div.find_all('span', class_='mw-editsection'):
                        el.decompose()

                    raw_html = str(content_div)
                    # Tailwind 排版优化，适应薛定谔系统的黑色UI
                    raw_html = raw_html.replace('<h2', '<h2 class="text-3xl font-black text-blue-400 mt-10 mb-6 border-b border-slate-700/50 pb-2"')
                    raw_html = raw_html.replace('<h3', '<h3 class="text-2xl font-bold text-cyan-300 mt-8 mb-4"')
                    raw_html = raw_html.replace('<p', '<p class="mb-6 text-slate-300 leading-loose text-lg tracking-wide"')
                    
                    chapters_data.append({"title": chap_title, "content": raw_html})
                    time.sleep(1) # 礼貌延时

                print(f"  ✅ 《{title}》全本采集完毕！共 {len(chapters_data)} 节纯英文科普内容。")
                
                data = {
                    "code_id": book_id, "title": title, "provider_type": "Elementary OER (K-6)", 
                    "icon": icon, "is_free": True, "source_url": url,
                    "description": "专为 8-11 岁儿童编写的纯英文非虚构类 (Non-fiction) 科学教材。图文并茂，极适合作为英语伴读语料。",
                    "chapters_json": chapters_data
                }
                self.push_to_db("edu_textbooks", data)

            except Exception as e:
                print(f"  ❌ Wikijunior 抓取失败: {e}")

    # ==========================================================================
    # 🎯 战略目标 2：McGuffey's Readers (北美百年经典分级阅读/拼读教材)
    # ==========================================================================
    def harvest_mcguffey_readers(self):
        print("\n" + "="*50)
        print(" 🚀 [K-3 幼小衔接] 启动北美经典分级阅读 (McGuffey's Readers) 转录...")
        print("="*50)
        
        # 麦加菲读本是美国历史上最畅销的小学拼读和阅读教材
        books = [
            ("tb_mcguffey_primer", "McGuffey's Eclectic Primer (Phonics & K-1)", "https://www.gutenberg.org/cache/epub/14640/pg14640-images.html"),
            ("tb_mcguffey_first", "McGuffey's First Eclectic Reader (Grade 1)", "https://www.gutenberg.org/cache/epub/14668/pg14668-images.html"),
            ("tb_mcguffey_second", "McGuffey's Second Eclectic Reader (Grade 2)", "https://www.gutenberg.org/cache/epub/14699/pg14699-images.html")
        ]
        
        for book_id, title, url in books:
            try:
                existing = supabase.table("edu_textbooks").select("code_id").eq("code_id", book_id).execute()
                if existing.data: continue
            except: pass

            print(f"\n  ⏳ 正在全量提取小学英语读本《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.content, 'html.parser')
                
                chapters = []
                current_chapter_title = "LESSON I"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    # 这类古腾堡文档通常以 h2 或 h3 为课文 (Lesson) 分割点
                    elements = body_content.find_all(['h2', 'h3', 'p', 'div'])
                    
                    for element in elements:
                        if element.name in ['h2', 'h3'] and 'LESSON' in element.get_text(strip=True).upper():
                            if current_content:
                                chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text:
                                current_content.append(f"<p class='mb-6 indent-8 text-slate-200 leading-loose text-xl font-serif tracking-wide'>{text}</p>")
                    
                    if current_content:
                        chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 节原汁原味的英文拼读课文。")
                
                data = {
                    "code_id": book_id, "title": title, "provider_type": "Primary Phonics (K-3)", 
                    "icon": "📖", "is_free": True, "source_url": url,
                    "description": "北美流传百年的小学英语阅读启蒙教材。短句、韵律、自然拼读，极适合作为 NOVA 伴读舱的纯英文训练底座。",
                    "chapters_json": chapters
                }
                self.push_to_db("edu_textbooks", data)
                time.sleep(3)
                
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 战略目标 3：OpenStax Middle School (初中阶纯正教材)
    # ==========================================================================
    def harvest_openstax_middle_school(self):
        print("\n" + "="*50)
        print(" 🚀 [Middle School 中学目标] 启动 OpenStax 初级学科全卷收割...")
        print("="*50)
        
        # 排除大学内容，精准定位适合 6-9 年级 (初中阶段) 的预备教材
        target_books = [
            ("prealgebra-2e", "Prealgebra 2e (预备代数 Grade 6-8)", "📐"),
            ("concepts-biology", "Concepts of Biology (生物学概念 Grade 8-10)", "🧬"),
            ("us-history", "U.S. History (美国历史 Grade 8-10)", "🌍")
        ]
        
        for slug, title, icon in target_books:
            book_id = f"tb_os_{slug.replace('-', '_')}"
            
            try:
                existing = supabase.table("edu_textbooks").select("code_id").eq("code_id", book_id).execute()
                if existing.data:
                    print(f"  ⏭️ [跳过] 《{title}》已入库。")
                    continue
            except: pass

            print(f"  ⏳ 正在深度提取中学教材《{title}》全书图文...")
            
            toc_page_url = f"https://openstax.org/books/{slug}/pages/1-introduction"
            
            try:
                res = requests.get(toc_page_url, headers=self.headers, timeout=15)
                if res.status_code == 404:
                    toc_page_url = toc_page_url.replace("1-introduction", "preface")
                    res = requests.get(toc_page_url, headers=self.headers, timeout=15)
                
                soup = BeautifulSoup(res.text, 'html.parser')
                chapter_urls = []
                
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    abs_url = urljoin(toc_page_url, href)
                    if '/pages/' in abs_url and '#' not in abs_url and abs_url not in chapter_urls:
                        chapter_urls.append(abs_url)

                if not chapter_urls: continue
                    
                print(f"    🎯 嗅探到 {len(chapter_urls)} 个章节！自动翻页收割中...")
                chapters_data = []
                
                for idx, full_url in enumerate(chapter_urls):
                    try:
                        c_res = requests.get(full_url, headers=self.headers, timeout=10)
                        c_soup = BeautifulSoup(c_res.text, 'html.parser')
                        content_container = c_soup.find('div', attrs={'data-type': 'page'})
                        if not content_container: continue

                        chap_title = f"Chapter {idx+1}"
                        title_el = content_container.find(attrs={'data-type': 'document-title'})
                        if title_el: chap_title = title_el.get_text(strip=True)

                        for element in content_container(["script", "style", "nav", "button", "footer"]):
                            element.decompose()

                        raw_html = str(content_container)
                        raw_html = raw_html.replace('<h3', '<h3 class="text-2xl font-bold text-blue-300 mt-8 mb-4 border-b border-slate-700/50 pb-2"')
                        raw_html = raw_html.replace('<p', '<p class="mb-6 text-slate-300 leading-loose text-base tracking-wide"')

                        chapters_data.append({"title": chap_title, "content": raw_html})
                    except: pass
                    time.sleep(1.5) 

                print(f"    ✅ 《{title}》全本采集完毕！")

                data = {
                    "code_id": book_id, "title": title, "provider_type": "Middle School OER", 
                    "icon": icon, "is_free": True, "source_url": toc_page_url,
                    "description": "适合初中阶段的纯正北美原版教材，知识密度适中，学科词汇极其丰富。",
                    "chapters_json": chapters_data
                }
                self.push_to_db("edu_textbooks", data)

            except Exception as e:
                print(f"    ❌ 抓取遭遇错误: {e}")

    # ---------------------------------------------------------
    # 极速写入数据库
    # ---------------------------------------------------------
    def push_to_db(self, table_name, data):
        print(f"  📡 正在将海量图文压入 Supabase 云端节点 ({table_name})...")
        try:
            supabase.table(table_name).upsert(data).execute()
            print(f"  🎉 卷宗 【{data['title']}】 入库圆满成功！\n")
        except Exception as e:
            print(f"  ❌ 致命错误：数据库拒绝写入: {e}")

# ==========================================
# 爬虫总控室 (指挥官专享 K-12 英文底座版)
# ==========================================
if __name__ == "__main__":
    print("="*70)
    print("   XuePilot K-12 纯英文教材爬虫矩阵 (V7.0 幼小初专供版)   ")
    print("   ⚠️ 正在收割北美的自然拼读、维基儿童科普与中学原版教材...  ")
    print("="*70)
    
    spider = XuePilotK12Spider()
    
    # 任务一：小学阶段 (Elementary) - 维基百科儿童分级科普
    spider.harvest_wikijunior()
    
    # 任务二：幼小衔接 (K-3) - 北美百年自然拼读分级阅读
    spider.harvest_mcguffey_readers()

    # 任务三：中学阶段 (Middle School) - OpenStax 初中级数理文史
    spider.harvest_openstax_middle_school()
    
    print("="*70)
    print(" 🏆 K-12 纯英文体系数据底座搭建完毕！")
    print(" 您的孩子现在可以在前台探索舱中，直接阅读海量原汁原味的北美课本了！")
    print("="*70)