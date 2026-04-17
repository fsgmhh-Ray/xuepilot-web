import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse
from supabase import create_client, Client

# ==============================================================================
# XuePilot OER Spider (V8.0 航母级全球全量收割版 - K-12 英文 + 港台底座)
# 核心使命：无死角遍历纯英文小学(K-6)、北美经典启蒙、中学开源教材及港台繁体语料。
# ⚠️ 警告：全站遍历极度耗时，请挂机运行，切勿中断！
# ==============================================================================

# ✅ 您的 Supabase 链接与 Service Role Key
SUPABASE_URL = "https://cywslfalbedraeeggryj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA0ODk2MSwiZXhwIjoyMDkxNjI0OTYxfQ.zKrF72r5DTVzQhdTQNmYPpQf5DSDkdGW4bMxZx739qo" 

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class XuePilotK12Spider:
    def __init__(self):
        # 伪装成真实的浏览器，降低被拦截概率
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7'
        }

    # ==========================================================================
    # 🎯 战略集群 1：Wikijunior (维基儿童教科书) - K-6 纯英文科普大全
    # ==========================================================================
    def harvest_wikijunior(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 1: K-6 小学核心] 启动 Wikijunior 纯英文教科书全量收割...")
        print("★"*60)

        books = [
            ("tb_wj_solar_system", "Wikijunior: Solar System (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Solar_System", "🪐"),
            ("tb_wj_human_body", "Wikijunior: Human Body (K-6 Biology)", "https://en.wikibooks.org/wiki/Wikijunior:Human_Body", "🧬"),
            ("tb_wj_dinosaurs", "Wikijunior: Dinosaurs (K-6 History)", "https://en.wikibooks.org/wiki/Wikijunior:Dinosaurs", "🦖"),
            ("tb_wj_biology", "Wikijunior: Biology (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Biology", "🌱"),
            ("tb_wj_big_cats", "Wikijunior: Big Cats (K-6 Zoology)", "https://en.wikibooks.org/wiki/Wikijunior:Big_Cats", "🐅"),
            ("tb_wj_bugs", "Wikijunior: Bugs (K-6 Zoology)", "https://en.wikibooks.org/wiki/Wikijunior:Bugs", "🦋"),
            ("tb_wj_elements", "Wikijunior: The Elements (K-6 Chemistry)", "https://en.wikibooks.org/wiki/Wikijunior:The_Elements", "⚗️"),
            ("tb_wj_europe", "Wikijunior: Europe (K-6 Geography)", "https://en.wikibooks.org/wiki/Wikijunior:Europe", "🌍"),
            ("tb_wj_south_america", "Wikijunior: South America (K-6 Geography)", "https://en.wikibooks.org/wiki/Wikijunior:South_America", "🌎")
        ]

        for book_id, title, url, icon in books:
            if self._check_exists(book_id):
                print(f"  ⏭️ [跳过] 《{title}》已在智库中。")
                continue

            print(f"\n  ⏳ 正在潜入: 《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.text, 'html.parser')
                
                base_path = urlparse(url).path
                chapter_urls = []
                
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    if href.startswith(base_path + '/') and ':' not in href.replace(base_path, ''):
                        full_url = urljoin(url, href)
                        if full_url not in chapter_urls:
                            chapter_urls.append(full_url)

                if not chapter_urls:
                    print("  ❌ 未找到章节列表。")
                    continue
                
                print(f"  🎯 锁定 {len(chapter_urls)} 个章节，开启自动翻页...")
                chapters_data = []
                
                for idx, chap_url in enumerate(chapter_urls):
                    if idx % 5 == 0 and idx > 0: print(f"    ...已提取 {idx}/{len(chapter_urls)} 章...")
                        
                    c_res = requests.get(chap_url, headers=self.headers, timeout=10)
                    c_soup = BeautifulSoup(c_res.text, 'html.parser')
                    
                    content_div = c_soup.find('div', class_='mw-parser-output')
                    if not content_div: continue
                        
                    title_h1 = c_soup.find('h1', id='firstHeading')
                    chap_title = title_h1.get_text(strip=True).split('/')[-1].replace('_', ' ') if title_h1 else f"Chapter {idx+1}"

                    for el in content_div.find_all(['table', 'div'], class_=['navbox', 'infobox', 'noprint']): el.decompose()
                    for el in content_div.find_all('span', class_='mw-editsection'): el.decompose()

                    raw_html = str(content_div)
                    raw_html = raw_html.replace('<h2', '<h2 class="text-3xl font-black text-blue-400 mt-10 mb-6 border-b border-slate-700/50 pb-2"')
                    raw_html = raw_html.replace('<h3', '<h3 class="text-2xl font-bold text-cyan-300 mt-8 mb-4"')
                    raw_html = raw_html.replace('<p', '<p class="mb-6 text-slate-300 leading-loose text-lg tracking-wide"')
                    
                    chapters_data.append({"title": chap_title, "content": raw_html})
                    time.sleep(1)

                print(f"  ✅ 《{title}》全本采集完毕！")
                
                data = {
                    "code_id": book_id, "title": title, "provider_type": "Elementary OER (K-6)", 
                    "icon": icon, "is_free": True, "source_url": url,
                    "description": "专为 8-11 岁儿童编写的纯英文非虚构类 (Non-fiction) 科学与人文教材。图文并茂，非常适合伴读。",
                    "chapters_json": chapters_data
                }
                self.push_to_db("edu_textbooks", data)

            except Exception as e:
                print(f"  ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 战略集群 2：北美百年经典 + 趣味科普 (K-6 阅读/历史/自然)
    # ==========================================================================
    def harvest_na_classics(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 2: 北美阅读底座] 启动 K-6 经典科普与自然拼读收割...")
        print("★"*60)
        
        books = [
            ("tb_mcguffey_primer", "McGuffey's Eclectic Primer (Phonics & K-1)", "https://www.gutenberg.org/cache/epub/14640/pg14640-images.html", "📖"),
            ("tb_mcguffey_first", "McGuffey's First Eclectic Reader (Grade 1)", "https://www.gutenberg.org/cache/epub/14668/pg14668-images.html", "📖"),
            ("tb_mcguffey_second", "McGuffey's Second Eclectic Reader (Grade 2)", "https://www.gutenberg.org/cache/epub/14699/pg14699-images.html", "📖"),
            ("tb_burgess_animals", "The Burgess Animal Book for Children (K-6 Science)", "https://www.gutenberg.org/files/3223/3223-h/3223-h.htm", "🦊"),
            ("tb_great_inventors", "Great Inventors and Their Inventions (K-6 History)", "https://www.gutenberg.org/files/24712/24712-h/24712-h.htm", "💡"),
            ("tb_child_history_eng", "A Child's History of England (K-6 History)", "https://www.gutenberg.org/files/699/699-h/699-h.htm", "🏰")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id):
                print(f"  ⏭️ [跳过] 《{title}》已入库。")
                continue

            print(f"\n  ⏳ 正在提取百年经典丛书《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.content, 'html.parser')
                
                chapters = []
                current_chapter_title = "INTRODUCTION"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    # 针对古腾堡的结构，通常按 h2/h3 分割
                    elements = body_content.find_all(['h2', 'h3', 'p'])
                    print(f"    🔍 扫描到 {len(elements)} 个段落节点，开始切分章节...")
                    
                    for element in elements:
                        # 触发新章节的条件 (McGuffey 用 LESSON，其他书用 CHAPTER)
                        header_text = element.get_text(strip=True).upper()
                        is_chapter_header = element.name in ['h2', 'h3'] and len(header_text) > 2

                        if is_chapter_header:
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
                
                print(f"    ✅ 成功解析 {len(chapters)} 节课文/故事。")
                
                data = {
                    "code_id": book_id, "title": title, "provider_type": "Primary Classics (K-6)", 
                    "icon": icon, "is_free": True, "source_url": url,
                    "description": "北美流传百年的小学英语启蒙与经典自然/历史科普教材。语言纯正优美，极适合作为英语思维训练底座。",
                    "chapters_json": chapters
                }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
                
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 战略集群 3：港台地区国文与核心素养 (HK/TW Traditional Chinese)
    # ==========================================================================
    def harvest_hk_tw_classics(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 3: 港台教育底座] 启动繁体中文经典与国学素养库收割...")
        print("★"*60)
        
        books = [
            ("tb_tw_sanzijing", "《三字經》(Three Character Classic - 繁体字版)", "https://www.gutenberg.org/files/24225/24225-h/24225-h.htm", "📜"),
            ("tb_tw_qianziwen", "《千字文》(Thousand Character Classic - 繁体字版)", "https://www.gutenberg.org/files/24226/24226-h/24226-h.htm", "📜"),
            ("tb_tw_tangshi", "《唐詩三百首》(300 Tang Poems - 繁体字版)", "https://www.gutenberg.org/files/24224/24224-h/24224-h.htm", "🏮")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id):
                print(f"  ⏭️ [跳过] 《{title}》已入库。")
                continue

            print(f"\n  ⏳ 正在提取港台国学启蒙《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                res.encoding = 'utf-8' # 古腾堡中文常常需要显式声明
                soup = BeautifulSoup(res.text, 'html.parser')
                
                chapters = []
                current_chapter_title = "經典原文 (Classic Text)"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    elements = body_content.find_all(['h2', 'h3', 'p'])
                    
                    for element in elements:
                        if element.name in ['h2', 'h3']:
                            if current_content:
                                chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text:
                                # 繁体经典通常需要大字号、宽行距排版
                                current_content.append(f"<p class='mb-8 text-slate-200 leading-[3rem] text-2xl font-serif tracking-[0.2em]'>{text}</p>")
                    
                    if current_content:
                        chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 卷繁体经典。")
                
                data = {
                    "code_id": book_id, "title": title, "provider_type": "HK/TW Core (K-6)", 
                    "icon": icon, "is_free": True, "source_url": url,
                    "description": "港台地区小学国文教育最核心的启蒙经典（繁体字版），用于培养中华文化传承与汉字审美。",
                    "chapters_json": chapters
                }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
                
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 战略集群 4：OpenStax Middle School (初中阶纯正学科教材)
    # ==========================================================================
    def harvest_openstax_middle_school(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 4: Middle School 中学目标] 启动初级理科与文史收割...")
        print("★"*60)
        
        target_books = [
            ("prealgebra-2e", "Prealgebra 2e (预备代数 Grade 6-8)", "📐"),
            ("concepts-biology", "Concepts of Biology (生物学概念 Grade 8-10)", "🧬"),
            ("us-history", "U.S. History (美国历史 Grade 8-10)", "🌍")
        ]
        
        for slug, title, icon in target_books:
            book_id = f"tb_os_{slug.replace('-', '_')}"
            
            if self._check_exists(book_id):
                print(f"  ⏭️ [跳过] 《{title}》已入库。")
                continue

            print(f"\n  ⏳ 正在深度提取中学教材《{title}》全站图文...")
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
    # 辅助工具函数
    # ---------------------------------------------------------
    def _check_exists(self, code_id):
        """检查数据库是否已存在该教材"""
        try:
            existing = supabase.table("edu_textbooks").select("code_id").eq("code_id", code_id).execute()
            if existing.data:
                return True
        except:
            pass
        return False

    def push_to_db(self, table_name, data):
        print(f"  📡 正在将海量图文压入 Supabase 云端节点 ({table_name})...")
        try:
            supabase.table(table_name).upsert(data).execute()
            print(f"  🎉 卷宗 【{data['title']}】 入库圆满成功！\n")
        except Exception as e:
            print(f"  ❌ 致命错误：数据库拒绝写入: {e}")

# ==========================================
# 爬虫总控室 (指挥官专享 K-12 英文全生态 + 港台底座版)
# ==========================================
if __name__ == "__main__":
    print("="*75)
    print("   XuePilot 航母级全球教研爬虫矩阵 (V8.0 终极全量版)   ")
    print("   ⚠️ 正在收割北美的自然拼读、维基儿童科普、港台繁体经典与中学教材...  ")
    print("   ⏳ 预计耗时 10-20 分钟，请保持终端运行... ")
    print("="*75)
    
    spider = XuePilotK12Spider()
    
    # 任务一：K-6 小学阶段 (Elementary) - 维基百科儿童 9 大精选科普
    spider.harvest_wikijunior()
    
    # 任务二：K-6 经典阅读 - 北美百年自然拼读分级阅读与动物/历史启蒙
    spider.harvest_na_classics()

    # 任务三：K-6 港台繁体底座 - 传统国学经典（三字经、千字文、唐诗）
    spider.harvest_hk_tw_classics()

    # 任务四：中学阶段 (Middle School) - OpenStax 初中级数理文史
    spider.harvest_openstax_middle_school()
    
    print("="*75)
    print(" 🏆 K-12 英文全生态 + 港台底座 搭建完毕！")
    print(" 您的孩子现在可以在前台探索舱中，直接阅读海量原汁原味的全球教科书了！")
    print("="*75)