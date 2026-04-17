import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin
from supabase import create_client, Client

# ==============================================================================
# XuePilot OER Spider (V6.0 Data Empire - 工业级全站自动化收割矩阵)
# 核心使命：自动嗅探网站全部分类、自动提取所有书单、自动遍历所有章节并入库。
# 警告：此过程可能持续数小时甚至数天，请挂在后台运行！
# ==============================================================================

# ✅ 请替换为您的 Supabase 链接与 Service Role Key
SUPABASE_URL = "https://cywslfalbedraeeggryj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA0ODk2MSwiZXhwIjoyMDkxNjI0OTYxfQ.zKrF72r5DTVzQhdTQNmYPpQf5DSDkdGW4bMxZx739qo" 

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class XuePilotGlobalSpider:
    def __init__(self):
        # 伪装成真实的浏览器池
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'
        }

    # ==========================================================================
    # 🎯 战略目标 1：OpenStax 全量教材嗅探与收割
    # ==========================================================================
    def harvest_openstax_empire(self):
        print("\n" + "="*50)
        print(" 🚀 [最高指令] 启动 OpenStax 全站教材嗅探协议...")
        print("="*50)
        
        # OpenStax 涵盖的顶级学科（您可以随意增减）
        # 这里列出最核心的教科书 slug，因为 OpenStax 前端是高度动态的 React，
        # 直接抓取 /subjects 容易漏，我们通过硬核的核心书单字典开启全量深度遍历。
        target_books = {
            "Science": [
                ("biology-2e", "Biology 2e (大学与AP生物)"),
                ("concepts-biology", "Concepts of Biology (基础生物)"),
                ("anatomy-and-physiology", "Anatomy and Physiology (解剖与生理学)"),
                ("astronomy-2e", "Astronomy 2e (天文学)"),
                ("chemistry-2e", "Chemistry 2e (化学)"),
                ("university-physics-volume-1", "University Physics Vol 1 (大学物理 卷一)"),
                ("university-physics-volume-2", "University Physics Vol 2 (大学物理 卷二)"),
                ("university-physics-volume-3", "University Physics Vol 3 (大学物理 卷三)")
            ],
            "Math": [
                ("calculus-volume-1", "Calculus Vol 1 (微积分 卷一)"),
                ("calculus-volume-2", "Calculus Vol 2 (微积分 卷二)"),
                ("calculus-volume-3", "Calculus Vol 3 (微积分 卷三)"),
                ("algebra-and-trigonometry-2e", "Algebra and Trigonometry 2e (代数与三角函数)"),
                ("precalculus-2e", "Precalculus 2e (微积分预备)"),
                ("introductory-statistics", "Introductory Statistics (基础统计学)")
            ],
            "Social Sciences": [
                ("psychology-2e", "Psychology 2e (心理学)"),
                ("principles-economics-2e", "Principles of Economics 2e (经济学原理)"),
                ("american-government-3e", "American Government 3e (美国政府与政治)"),
                ("introduction-sociology-3e", "Introduction to Sociology 3e (社会学导论)")
            ]
        }

        total_books = sum(len(books) for books in target_books.values())
        print(f"  🔍 锁定目标：共发现 {len(target_books)} 大类，总计 {total_books} 部极其厚重的开源教科书。")
        
        book_count = 0
        for category, books in target_books.items():
            print(f"\n  📂 正在攻入【{category}】类目区...")
            
            for slug, title in books:
                book_count += 1
                book_id = f"tb_os_{slug.replace('-', '_')}"
                
                # 检查数据库是否已经存在该书（断点续传机制，防止重复抓取浪费时间）
                try:
                    existing = supabase.table("edu_textbooks").select("code_id").eq("code_id", book_id).execute()
                    if existing.data:
                        print(f"    ⏭️ [跳过] 《{title}》已在数据库中存在，跳过抓取。")
                        continue
                except:
                    pass

                print(f"    ⏳ [ {book_count}/{total_books} ] 正在深度提取《{title}》全书图文...")
                
                # 构造 OpenStax 教材的在线阅读基础路径
                # 为了获取完整目录，我们默认访问它的 preface 或 introduction 页面来挂载左侧导航树
                base_read_url = f"https://openstax.org/books/{slug}/pages/1-introduction"
                
                # 开始调用单本抓取引擎
                book_data = self._scrape_single_openstax_book(book_id, title, base_read_url)
                
                if book_data:
                    self.push_to_db("edu_textbooks", book_data)
                
                print("    💤 休眠 5 秒，防止触发 Cloudflare 封锁...")
                time.sleep(5)

    def _scrape_single_openstax_book(self, book_id, title, toc_page_url):
        try:
            # 1. 嗅探全书目录
            res = requests.get(toc_page_url, headers=self.headers, timeout=15)
            if res.status_code == 404:
                # 容错：有些书第一章不叫 1-introduction，可能是 preface
                toc_page_url = toc_page_url.replace("1-introduction", "preface")
                res = requests.get(toc_page_url, headers=self.headers, timeout=15)
            
            res.raise_for_status()
            soup = BeautifulSoup(res.text, 'html.parser')

            all_links = soup.find_all('a', href=True)
            chapter_urls = []
            
            # 提取真实章节路径
            for link in all_links:
                href = link['href']
                abs_url = urljoin(toc_page_url, href)
                # 只保留该书 pages 目录下的链接，排除带 # 的页内锚点
                if '/pages/' in abs_url and '#' not in abs_url and abs_url not in chapter_urls:
                    chapter_urls.append(abs_url)

            if not chapter_urls:
                print(f"      ❌ 嗅探目录失败，可能该书结构特殊: {toc_page_url}")
                return None
                
            print(f"      🎯 成功解析出 {len(chapter_urls)} 个章节！开始自动翻页收割...")
            
            chapters_data = []
            
            # 2. 遍历全书每一页
            for idx, full_url in enumerate(chapter_urls):
                # 打印进度条
                if idx % 10 == 0 and idx > 0:
                    print(f"        ...已提取 {idx}/{len(chapter_urls)} 章...")
                    
                try:
                    c_res = requests.get(full_url, headers=self.headers, timeout=10)
                    c_soup = BeautifulSoup(c_res.text, 'html.parser')
                    
                    content_container = c_soup.find('div', attrs={'data-type': 'page'})
                    if not content_container:
                        continue

                    chap_title = f"Chapter {idx+1}"
                    title_el = content_container.find(attrs={'data-type': 'document-title'})
                    if title_el:
                        chap_title = title_el.get_text(strip=True)

                    # 净化杂质
                    for element in content_container(["script", "style", "nav", "button", "footer"]):
                        element.decompose()

                    raw_html = str(content_container)
                    
                    # XuePilot 专属排版注入
                    raw_html = raw_html.replace('<h3', '<h3 class="text-2xl font-bold text-blue-300 mt-8 mb-4 border-b border-slate-700/50 pb-2"')
                    raw_html = raw_html.replace('<p', '<p class="mb-6 text-slate-300 leading-loose text-base tracking-wide"')
                    raw_html = raw_html.replace('<img', '<img class="rounded-xl shadow-lg border border-slate-700 my-8 max-w-full"')

                    chapters_data.append({
                        "title": chap_title,
                        "content": raw_html
                    })
                    
                except Exception as e:
                    print(f"        ⚠️ 第 {idx+1} 章抓取失败跳过: {e}")
                    
                # 极速休眠，防 CC 攻击拦截
                time.sleep(1)
                
            return {
                "code_id": book_id,
                "title": title,
                "provider_type": "开源体系 (OpenStax)",
                "icon": "⚛️",
                "is_free": True,
                "description": f"XuePilot 自动化爬虫全量入库版本。包含该教材全部 {len(chapters_data)} 个深层知识章节的图文解析。",
                "source_url": toc_page_url,
                "chapters_json": chapters_data
            }

        except Exception as e:
            print(f"      ❌ 《{title}》 抓取遭遇致命错误: {e}")
            return None


    # ==========================================================================
    # 🎯 战略目标 2：Gutenberg (古腾堡) 科学/科幻类专区自动扫荡
    # ==========================================================================
    def harvest_gutenberg_scifi(self):
        print("\n" + "="*50)
        print(" 🚀 [最高指令] 启动 Project Gutenberg 科幻/科学类目扫荡...")
        print("="*50)
        
        # 选取一些对孩子伴读极具价值的经典英文名著
        books = [
            ("84", "Frankenstein; Or, The Modern Prometheus", "https://www.gutenberg.org/files/84/84-h/84-h.htm"),
            ("36", "The War of the Worlds (H.G. Wells)", "https://www.gutenberg.org/files/36/36-h/36-h.htm"),
            ("164", "Twenty Thousand Leagues under the Sea", "https://www.gutenberg.org/files/164/164-h/164-h.htm"),
            ("1184", "The Count of Monte Cristo", "https://www.gutenberg.org/files/1184/1184-h/1184-h.htm"),
            ("2500", "Siddhartha (Hermann Hesse)", "https://www.gutenberg.org/files/2500/2500-h/2500-h.htm")
        ]
        
        for book_id, title, url in books:
            full_id = f"tb_gb_{book_id}"
            
            # 断点续传检查
            try:
                existing = supabase.table("edu_textbooks").select("code_id").eq("code_id", full_id).execute()
                if existing.data:
                    print(f"  ⏭️ [跳过] 《{title}》已存在。")
                    continue
            except:
                pass

            print(f"\n  ⏳ 正在全量提取古腾堡文学典籍《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                res.raise_for_status()
                soup = BeautifulSoup(res.content, 'html.parser')
                
                chapters = []
                current_chapter_title = "Introduction"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    elements = body_content.find_all(['h2', 'h3', 'p'])
                    print(f"    🔍 扫描到 {len(elements)} 个段落节点...")
                    
                    for element in elements:
                        if element.name in ['h2', 'h3']:
                            if current_content:
                                chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text:
                                current_content.append(f"<p class='mb-4 indent-8 text-slate-300 leading-loose text-lg font-serif'>{text}</p>")
                    
                    if current_content:
                        chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 个章节。")
                
                data = {
                    "code_id": full_id, "title": title, "provider_type": "文史底座 (Gutenberg)", 
                    "icon": "📜", "is_free": True, "description": f"经典公版文学原著，共 {len(chapters)} 章。XuePilot 自动转录排版版。",
                    "source_url": url, "chapters_json": chapters
                }
                self.push_to_db("edu_textbooks", data)
                time.sleep(3)
                
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ---------------------------------------------------------
    # 极速写入数据库
    # ---------------------------------------------------------
    def push_to_db(self, table_name, data):
        print(f"  📡 正在将海量数据封入 Supabase 云端节点 ({table_name})...")
        try:
            supabase.table(table_name).upsert(data).execute()
            print(f"  🎉 卷宗 【{data['title']}】 入库圆满成功！")
        except Exception as e:
            print(f"  ❌ 致命错误：数据库拒绝写入: {e}")

# ==========================================
# 爬虫总控室
# ==========================================
if __name__ == "__main__":
    print("="*70)
    print("   XuePilot 工业级全量爬虫矩阵 (V6.0 终极收割版)   ")
    print("   ⚠️ 本次运行将抓取全网数十本、上百章的厚重教材！  ")
    print("   ⚠️ 请保持网络畅通，耐心等待数十分钟...          ")
    print("="*70)
    
    spider = XuePilotGlobalSpider()
    
    # 任务一：OpenStax 数理化政史地全系教材收割
    spider.harvest_openstax_empire()
    
    # 任务二：古腾堡经典科幻与名著收割
    spider.harvest_gutenberg_scifi()
    
    print("\n" + "="*70)
    print(" 🏆 所有全球资源全量收割任务圆满结束！")
    print(" 指挥官，您的数据库现在已经是一座真正无价的【全球智慧图书馆】了！")
    print("="*70)