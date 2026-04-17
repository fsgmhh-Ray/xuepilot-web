import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse
from supabase import create_client, Client

# ==============================================================================
# XuePilot OER Spider (V9.0 终极全球版 - K-12 英文+数学+英联邦多国底座)
# 核心使命：无死角遍历纯英文小学(K-6)、北美/加拿大/英国/澳洲经典、核心数学及港台语料。
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
    # 🎯 战略集群 1：K-6 纯英文核心数学与科普 (Wikibooks/Wikijunior)
    # ==========================================================================
    def harvest_wiki_math_and_science(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 1: K-6 核心数理] 启动纯英文数学与科学教科书全量收割...")
        print("★"*60)

        books = [
            # 核心数学基石
            ("tb_wiki_arithmetic", "Wikibooks: Arithmetic (K-5 Math)", "https://en.wikibooks.org/wiki/Arithmetic", "🧮"),
            # 核心科普基石
            ("tb_wj_solar_system", "Wikijunior: Solar System (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Solar_System", "🪐"),
            ("tb_wj_human_body", "Wikijunior: Human Body (K-6 Biology)", "https://en.wikibooks.org/wiki/Wikijunior:Human_Body", "🧬"),
            ("tb_wj_dinosaurs", "Wikijunior: Dinosaurs (K-6 History)", "https://en.wikibooks.org/wiki/Wikijunior:Dinosaurs", "🦖"),
            ("tb_wj_biology", "Wikijunior: Biology (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Biology", "🌱")
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
                    "code_id": book_id, "title": title, "provider_type": "Primary Core (K-6)", 
                    "icon": icon, "is_free": True, "source_url": url,
                    "description": "开源纯英文核心教材。涵盖小学阶段的数学基础概念与非虚构类 (Non-fiction) 科学常识。",
                    "chapters_json": chapters_data
                }
                self.push_to_db("edu_textbooks", data)

            except Exception as e:
                print(f"  ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 战略集群 2：英联邦与北美纯正读物 (Canada / UK / Australia / US)
    # 包含了加拿大安大略省百年教材、英国经典文学、澳洲国民启蒙
    # ==========================================================================
    def harvest_commonwealth_and_us_readers(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 2: 全球英语底座] 启动加/英/澳/美 K-6 经典课本收割...")
        print("★"*60)
        
        books = [
            # 🍁 加拿大 (Canada) - The Ontario Readers (安大略省百年公立教材)
            ("tb_ca_ontario_1", "The Ontario Readers: First Book (Canada Grade 1)", "https://www.gutenberg.org/files/37682/37682-h/37682-h.htm", "🍁"),
            ("tb_ca_ontario_2", "The Ontario Readers: Second Book (Canada Grade 2)", "https://www.gutenberg.org/files/38401/38401-h/38401-h.htm", "🍁"),
            ("tb_ca_ontario_3", "The Ontario Readers: Third Book (Canada Grade 3)", "https://www.gutenberg.org/files/39535/39535-h/39535-h.htm", "🍁"),
            
            # 🇬🇧 英国 (UK) - 经典纯正英式英语语料
            ("tb_uk_jungle_book", "The Jungle Book (UK Classic Reading)", "https://www.gutenberg.org/files/236/236-h/236-h.htm", "🇬🇧"),
            ("tb_uk_peter_pan", "Peter Pan (UK Classic Reading)", "https://www.gutenberg.org/files/16/16-h/16-h.htm", "🇬🇧"),
            
            # 🇦🇺 澳大利亚 (Australia) - 澳洲国民级启蒙
            ("tb_au_dot_kangaroo", "Dot and the Kangaroo (Australia Reading)", "https://www.gutenberg.org/files/4236/4236-h/4236-h.htm", "🇦🇺"),
            
            # 🇺🇸 美国 (US) - 麦加菲分级读本
            ("tb_us_mcguffey_primer", "McGuffey's Eclectic Primer (US Phonics)", "https://www.gutenberg.org/cache/epub/14640/pg14640-images.html", "🇺🇸"),
            ("tb_us_mcguffey_first", "McGuffey's First Eclectic Reader (US Grade 1)", "https://www.gutenberg.org/cache/epub/14668/pg14668-images.html", "🇺🇸"),
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id):
                print(f"  ⏭️ [跳过] 《{title}》已入库。")
                continue

            print(f"\n  ⏳ 正在提取英联邦/北美经典丛书《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.content, 'html.parser')
                
                chapters = []
                current_chapter_title = "INTRODUCTION"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    # 针对古腾堡的各种排版，统一抓取核心内容
                    elements = body_content.find_all(['h2', 'h3', 'h4', 'p'])
                    print(f"    🔍 扫描到 {len(elements)} 个段落节点，开始切分章节...")
                    
                    for element in elements:
                        header_text = element.get_text(strip=True).upper()
                        # 触发新章节的条件 (兼容 LESSON, CHAPTER, SELECTION 或直接是独立标题)
                        is_chapter_header = element.name in ['h2', 'h3', 'h4'] and len(header_text) > 2

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
                    "code_id": book_id, "title": title, "provider_type": "Global English (K-6)", 
                    "icon": icon, "is_free": True, "source_url": url,
                    "description": "横跨美国、加拿大、英国、澳洲的国民级经典语文/阅读教材。为您提供全球最纯正、多维度的英语思维训练底座。",
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
            ("tb_tw_sanzijing", "《三字經》(Three Character Classic - 繁体版)", "https://www.gutenberg.org/files/24225/24225-h/24225-h.htm", "📜"),
            ("tb_tw_qianziwen", "《千字文》(Thousand Character Classic - 繁体版)", "https://www.gutenberg.org/files/24226/24226-h/24226-h.htm", "📜")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id):
                print(f"  ⏭️ [跳过] 《{title}》已入库。")
                continue

            print(f"\n  ⏳ 正在提取港台国学启蒙《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                res.encoding = 'utf-8'
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
    # 🎯 战略集群 4：OpenStax Middle School (初中阶预备教材)
    # ==========================================================================
    def harvest_openstax_middle_school(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 4: Middle School 中学预备] 启动初级理科与文史收割...")
        print("★"*60)
        
        target_books = [
            ("prealgebra-2e", "Prealgebra 2e (预备代数 Grade 6-8)", "📐"),
            ("concepts-biology", "Concepts of Biology (生物学概念 Grade 8-10)", "🧬")
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
# 爬虫总控室 (指挥官专享: 跨国英语+核心数学版)
# ==========================================
if __name__ == "__main__":
    print("="*75)
    print("   XuePilot 航母级全球教研爬虫矩阵 (V9.0 全球联邦版)   ")
    print("   ⚠️ 正在收割：核心数学、加拿大/英国/澳洲英语原版、港台繁体底座...  ")
    print("   ⏳ 预计耗时 10-20 分钟，请保持终端运行... ")
    print("="*75)
    
    spider = XuePilotK12Spider()
    
    # 任务一：K-6 小学核心 (数学与科普)
    spider.harvest_wiki_math_and_science()
    
    # 任务二：K-6 全球英语 (加拿大/英国/澳洲/美国)
    spider.harvest_commonwealth_and_us_readers()

    # 任务三：K-6 港台繁体底座
    spider.harvest_hk_tw_classics()

    # 任务四：Middle School 初中阶理科
    spider.harvest_openstax_middle_school()
    
    print("="*75)
    print(" 🏆 全球四大洲教育底座 搭建完毕！")
    print(" 您的孩子现在不仅可以阅读纯正的英文科普，还能学习原汁原味的英联邦名著与英语数学！")
    print("="*75)