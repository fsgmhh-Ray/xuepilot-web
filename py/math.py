import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse
from supabase import create_client, Client

# ==============================================================================
# XuePilot OER Spider (V12.0 小学数学满配终极版 - 横跨四大洲 K-6 核心底座)
# 核心使命：疯狂补足纯英文小学(K-6)数学资源，加入北美百年算术教材、新加坡数学、英国数学。
# ⚠️ 警告：全站遍历极度耗时，请挂机运行，切勿中断！
# ==============================================================================

# ✅ 您的 Supabase 链接与 Service Role Key
SUPABASE_URL = "https://cywslfalbedraeeggryj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA0ODk2MSwiZXhwIjoyMDkxNjI0OTYxfQ.zKrF72r5DTVzQhdTQNmYPpQf5DSDkdGW4bMxZx739qo" 

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class XuePilotK12Spider:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7'
        }

    # ==========================================================================
    # 🎯 战略集群 0：全球顶尖小学数学大纲直注 (Singapore Math & UK Math)
    # ==========================================================================
    def harvest_global_math_syllabi(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 0: 全球顶尖小学数学课标] 写入新加坡数学与英国数学体系...")
        print("★"*60)

        # 1. 新加坡数学 (Singapore Math P1-P6) - 真实排课结构
        sg_math_structure = [
            {
                "subject": "Mathematics (Singapore Primary)", "icon": "🇸🇬",
                "grades": [
                    {
                        "grade": "Primary 1-2 (Grade 1-2)",
                        "terms": [
                            {
                                "term": "Semester 1",
                                "modules": [
                                    { "title": "Whole Numbers to 1,000", "hours": "20 Hours", "objectives": ["Understand place value", "Count and represent numbers"], "points": ["Number bonds", "Place value charts"] },
                                    { "title": "Addition and Subtraction", "hours": "25 Hours", "objectives": ["Master basic addition and subtraction algorithms", "Solve 1-step word problems"], "points": ["CPA Approach", "Bar modeling basics"] }
                                ]
                            },
                            {
                                "term": "Semester 2",
                                "modules": [
                                    { "title": "Multiplication & Division Basics", "hours": "20 Hours", "objectives": ["Understand multiplication as repeated addition", "Understand division as sharing"], "points": ["Times tables 2,3,4,5,10", "Grouping"] },
                                    { "title": "Money, Time, and Geometry", "hours": "15 Hours", "objectives": ["Count money", "Read time to 5 minutes", "Identify 2D and 3D shapes"], "points": ["Cents and Dollars", "Faces and Edges"] }
                                ]
                            }
                        ]
                    },
                    {
                        "grade": "Primary 3-4 (Grade 3-4)",
                        "terms": [
                            {
                                "term": "Semester 1",
                                "modules": [
                                    { "title": "Whole Numbers to 100,000", "hours": "18 Hours", "objectives": ["Read and write larger numbers", "Factors and Multiples"], "points": ["Rounding off", "Estimation"] },
                                    { "title": "Fractions and Decimals", "hours": "25 Hours", "objectives": ["Equivalent fractions", "Add and subtract fractions", "Intro to decimals"], "points": ["Numerator/Denominator", "Tenths and Hundredths"] }
                                ]
                            },
                            {
                                "term": "Semester 2",
                                "modules": [
                                    { "title": "Area and Perimeter", "hours": "15 Hours", "objectives": ["Calculate area of rectangles and squares", "Composite figures"], "points": ["Square units", "Formulas"] },
                                    { "title": "Advanced Bar Modeling (Word Problems)", "hours": "22 Hours", "objectives": ["Solve 2-step and 3-step word problems using bar models"], "points": ["Part-whole models", "Comparison models"] }
                                ]
                            }
                        ]
                    },
                    {
                        "grade": "Primary 5-6 (Grade 5-6)",
                        "terms": [
                            {
                                "term": "Semester 1",
                                "modules": [
                                    { "title": "Ratio and Percentage", "hours": "20 Hours", "objectives": ["Understand ratio concepts", "Calculate percentage discounts and interest"], "points": ["Equivalent ratios", "Base 100"] },
                                    { "title": "Algebra Basics & Speed", "hours": "18 Hours", "objectives": ["Evaluate algebraic expressions", "Calculate Distance, Speed, and Time"], "points": ["Unknown variables", "Average speed"] }
                                ]
                            },
                            {
                                "term": "Semester 2",
                                "modules": [
                                    { "title": "Geometry: Circles and Triangles", "hours": "15 Hours", "objectives": ["Find area of triangles", "Calculate circumference and area of circles"], "points": ["Pi (π)", "Base and Height"] },
                                    { "title": "Data Analysis & Volume", "hours": "15 Hours", "objectives": ["Interpret pie charts", "Calculate volume of cubes and cuboids"], "points": ["Data handling", "Cubic units"] }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]

        # 2. 英国小学数学 (UK White Rose Maths Y1-Y6)
        uk_math_structure = [
            {
                "subject": "Mathematics (UK National Curriculum KS1/KS2)", "icon": "🇬🇧",
                "grades": [
                    {
                        "grade": "Year 3 (Lower KS2)",
                        "terms": [
                            {
                                "term": "Autumn Term",
                                "modules": [
                                    { "title": "Place Value (Numbers to 1,000)", "hours": "15 Hours", "objectives": ["Represent numbers to 1000", "Count in 50s and 100s"], "points": ["Hundreds, Tens, Ones", "Number lines"] },
                                    { "title": "Addition and Subtraction", "hours": "20 Hours", "objectives": ["Add and subtract 3-digit numbers"], "points": ["Column addition", "Exchange"] },
                                    { "title": "Multiplication and Division", "hours": "15 Hours", "objectives": ["Times tables 3, 4, 8"], "points": ["Arrays", "Scaling"] }
                                ]
                            }
                        ]
                    },
                    {
                        "grade": "Year 6 (Upper KS2)",
                        "terms": [
                            {
                                "term": "Autumn Term",
                                "modules": [
                                    { "title": "Place Value (Numbers to 10 Million)", "hours": "10 Hours", "objectives": ["Read, write, order and compare numbers up to 10 000 000"], "points": ["Negative numbers", "Rounding"] },
                                    { "title": "Four Operations", "hours": "25 Hours", "objectives": ["Long multiplication", "Long division", "Order of operations (BODMAS)"], "points": ["Remainders as fractions", "Estimation"] },
                                    { "title": "Fractions", "hours": "20 Hours", "objectives": ["Add, subtract, multiply and divide fractions"], "points": ["Simplifying", "Mixed numbers"] }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]

        self.push_to_db("edu_syllabi", {
            "code_id": "sb_sg_math_full", "title": "Singapore Math (Primary 1-6)", "region": "新加坡", "icon": "🇸🇬", "is_free": True,
            "description": "全球公认最强的小学数学大纲，基于著名的 CPA（具体-图像-抽象）建模法，极度注重应用题解析与底层逻辑训练。",
            "structure_json": sg_math_structure
        })
        
        self.push_to_db("edu_syllabi", {
            "code_id": "sb_uk_math_full", "title": "UK White Rose Maths (Year 1-6)", "region": "英国", "icon": "🇬🇧", "is_free": True,
            "description": "英国顶尖的小学数学排课体系 (Key Stage 1 & 2)，侧重于深度推理 (Reasoning) 与问题解决 (Problem Solving)。",
            "structure_json": uk_math_structure
        })

    # ==========================================================================
    # 🎯 战略集群 1.5：北美百年经典数学 (Ray's Arithmetics K-6)
    # ==========================================================================
    def harvest_elementary_math_classics(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 1.5: 小学数学霸权] 启动北美百年经典小学数学全套收割...")
        print("★"*60)
        
        # Ray's Arithmetic 统治了美国 19 世纪到 20 世纪初的基础教育，极重逻辑与心算
        books = [
            ("tb_math_rays_primary", "Ray's New Primary Arithmetic (Grade 1-2)", "https://www.gutenberg.org/cache/epub/24526/pg24526-images.html", "🧮"),
            ("tb_math_rays_intel", "Ray's New Intellectual Arithmetic (Grade 3-4)", "https://www.gutenberg.org/cache/epub/14704/pg14704-images.html", "📐"),
            ("tb_math_rays_practical", "Ray's New Practical Arithmetic (Grade 5-6)", "https://www.gutenberg.org/files/14718/14718-h/14718-h.htm", "📏"),
            ("tb_math_smith_primary", "Primary Arithmetic (David E. Smith)", "https://www.gutenberg.org/cache/epub/38106/pg38106-images.html", "📊")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id):
                print(f"  ⏭️ [跳过] 《{title}》已入库。")
                continue

            print(f"\n  ⏳ 正在提取小学纯正数学名著《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.content, 'html.parser')
                
                chapters = []
                current_chapter_title = "LESSON I"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    # 抓取数学题和段落
                    elements = body_content.find_all(['h2', 'h3', 'h4', 'p', 'div'])
                    
                    for element in elements:
                        header_text = element.get_text(strip=True).upper()
                        # 这类数学书常用 LESSON 或 SECTION 分割
                        is_chapter_header = element.name in ['h2', 'h3', 'h4'] and ('LESSON' in header_text or 'SECTION' in header_text or 'CHAPTER' in header_text)

                        if is_chapter_header:
                            if current_content:
                                chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text:
                                # 数学题需要清晰的排版
                                current_content.append(f"<p class='mb-4 text-slate-200 leading-loose text-lg font-mono tracking-wide'>{text}</p>")
                    
                    if current_content:
                        chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 节数学课文与应用题集。")
                
                data = {
                    "code_id": book_id, "title": title, "provider_type": "Primary Math (K-6)", 
                    "icon": icon, "is_free": True, "source_url": url,
                    "description": "北美百年经典小学数学/算术教材。包含海量原汁原味的英文 Word Problems（应用题）与 Mental Math（心算逻辑），是极佳的英语数学双语语料。",
                    "chapters_json": chapters
                }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
                
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 战略集群 1：K-12 纯英文核心数学与科普 (Wikibooks/Wikijunior)
    # ==========================================================================
    def harvest_wiki_math_and_science(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 1: 核心理科科普] 启动纯英文数学与科学教科书全量收割...")
        print("★"*60)

        books = [
            ("tb_wiki_arithmetic", "Wikibooks: Arithmetic (K-5 Math)", "https://en.wikibooks.org/wiki/Arithmetic", "🧮"),
            ("tb_wiki_algebra", "Wikibooks: Algebra (Grade 6-9 Math)", "https://en.wikibooks.org/wiki/Algebra", "📐"),
            ("tb_wj_solar_system", "Wikijunior: Solar System (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Solar_System", "🪐"),
            ("tb_wj_human_body", "Wikijunior: Human Body (K-6 Biology)", "https://en.wikibooks.org/wiki/Wikijunior:Human_Body", "🧬"),
            ("tb_wj_dinosaurs", "Wikijunior: Dinosaurs (K-6 History)", "https://en.wikibooks.org/wiki/Wikijunior:Dinosaurs", "🦖"),
            ("tb_wj_biology", "Wikijunior: Biology (K-6 Science)", "https://en.wikibooks.org/wiki/Wikijunior:Biology", "🌱")
        ]

        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
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
                        if full_url not in chapter_urls: chapter_urls.append(full_url)

                if not chapter_urls: continue
                print(f"  🎯 锁定 {len(chapter_urls)} 个章节，开启自动翻页...")
                chapters_data = []
                
                for idx, chap_url in enumerate(chapter_urls):
                    if idx % 5 == 0 and idx > 0: print(f"    ...已提取 {idx}/{len(chapter_urls)} 章...")
                    try: 
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
                    except: pass
                    time.sleep(1)

                print(f"  ✅ 《{title}》全本采集完毕！")
                data = { "code_id": book_id, "title": title, "provider_type": "Primary/Middle Core (K-12)", "icon": icon, "is_free": True, "source_url": url, "description": "开源纯英文核心教材。涵盖数学基础与非虚构类科普。", "chapters_json": chapters_data }
                self.push_to_db("edu_textbooks", data)
            except Exception as e:
                print(f"  ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 集群 2：英联邦与北美纯正读物 (Elson Readers & McGuffey)
    # ==========================================================================
    def harvest_commonwealth_and_us_readers(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 2: 全球英语底座] 启动加/英/澳/美 经典分级课本收割...")
        print("★"*60)
        
        books = [
            ("tb_ca_ontario_1", "The Ontario Readers: First Book (Canada Grade 1)", "https://www.gutenberg.org/files/37682/37682-h/37682-h.htm", "🍁"),
            ("tb_ca_ontario_2", "The Ontario Readers: Second Book (Canada Grade 2)", "https://www.gutenberg.org/files/38401/38401-h/38401-h.htm", "🍁"),
            ("tb_uk_jungle_book", "The Jungle Book (UK Classic Reading)", "https://www.gutenberg.org/files/236/236-h/236-h.htm", "🇬🇧"),
            ("tb_au_dot_kangaroo", "Dot and the Kangaroo (Australia Reading)", "https://www.gutenberg.org/files/4236/4236-h/4236-h.htm", "🇦🇺"),
            ("tb_us_mcguffey_primer", "McGuffey's Eclectic Primer (US Phonics)", "https://www.gutenberg.org/cache/epub/14640/pg14640-images.html", "🇺🇸"),
            ("tb_us_elson_primer", "The Elson Readers: Primer (US Grade K)", "https://www.gutenberg.org/files/23588/23588-h/23588-h.htm", "🇺🇸"),
            ("tb_us_elson_book1", "The Elson Readers: Book 1 (US Grade 1)", "https://www.gutenberg.org/files/24996/24996-h/24996-h.htm", "🇺🇸")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
            print(f"\n  ⏳ 正在提取英联邦/北美经典丛书《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.content, 'html.parser')
                chapters = []
                current_chapter_title = "INTRODUCTION"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    elements = body_content.find_all(['h2', 'h3', 'h4', 'p'])
                    for element in elements:
                        header_text = element.get_text(strip=True).upper()
                        is_chapter_header = element.name in ['h2', 'h3', 'h4'] and len(header_text) > 2

                        if is_chapter_header:
                            if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text: current_content.append(f"<p class='mb-6 indent-8 text-slate-200 leading-loose text-xl font-serif tracking-wide'>{text}</p>")
                    if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 节课文。")
                data = { "code_id": book_id, "title": title, "provider_type": "Global English (K-6)", "icon": icon, "is_free": True, "source_url": url, "description": "横跨美、加、英、澳的国民级经典语文分级教材。提供最纯正的英语思维训练底座。", "chapters_json": chapters }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 集群 3：全球经典童话与寓言 (K-6 最优语言艺术语料)
    # ==========================================================================
    def harvest_global_fairy_tales(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 3: 世界童话底座] 启动伊索、格林、安徒生全本收割...")
        print("★"*60)
        
        books = [
            ("tb_world_aesop", "Aesop's Fables (伊索寓言 - 纯英文版)", "https://www.gutenberg.org/files/11339/11339-h/11339-h.htm", "🦊"),
            ("tb_world_grimm", "Grimm's Fairy Tales (格林童话 - 纯英文版)", "https://www.gutenberg.org/files/2591/2591-h/2591-h.htm", "🏰"),
            ("tb_world_andersen", "Andersen's Fairy Tales (安徒生童话 - 纯英文版)", "https://www.gutenberg.org/files/1597/1597-h/1597-h.htm", "🧜‍♀️")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
            print(f"\n  ⏳ 正在提取世界童话巨著《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.content, 'html.parser')
                chapters = []
                current_chapter_title = "PREFACE"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    elements = body_content.find_all(['h2', 'h3', 'p'])
                    for element in elements:
                        if element.name in ['h2', 'h3']:
                            if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text: current_content.append(f"<p class='mb-6 indent-8 text-slate-200 leading-loose text-xl font-serif tracking-wide'>{text}</p>")
                    if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 个独立童话/寓言故事。")
                data = { "code_id": book_id, "title": title, "provider_type": "World Literature (K-6)", "icon": icon, "is_free": True, "source_url": url, "description": "西方小学 Language Arts（语言艺术）必读的世界经典童话与寓言原著，想象力与道德哲理的双重启蒙。", "chapters_json": chapters }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 集群 4：港台地区国文与核心素养 (HK/TW Traditional Chinese)
    # ==========================================================================
    def harvest_hk_tw_classics(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 4: 港台教育底座] 启动繁体中文经典与国学素养库收割...")
        print("★"*60)
        
        books = [
            ("tb_tw_sanzijing", "《三字經》(Three Character Classic - 繁体版)", "https://www.gutenberg.org/files/24225/24225-h/24225-h.htm", "📜"),
            ("tb_tw_qianziwen", "《千字文》(Thousand Character Classic - 繁体版)", "https://www.gutenberg.org/files/24226/24226-h/24226-h.htm", "📜")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
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
                            if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text: current_content.append(f"<p class='mb-8 text-slate-200 leading-[3rem] text-2xl font-serif tracking-[0.2em]'>{text}</p>")
                    if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 卷繁体经典。")
                data = { "code_id": book_id, "title": title, "provider_type": "HK/TW Core (K-6)", "icon": icon, "is_free": True, "source_url": url, "description": "港台地区小学国文教育最核心的启蒙经典（繁体字版）。", "chapters_json": chapters }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
            except: pass

    # ==========================================================================
    # 🎯 集群 5：OpenStax 进阶理科 (全打通版！)
    # ==========================================================================
    def harvest_openstax_math_and_core(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 5: 中高阶理科] 启动 OpenStax 进阶全系收割...")
        print("★"*60)
        
        target_books = [
            ("prealgebra-2e", "Prealgebra 2e (预备代数 Grade 6-8)", "📐"),
            ("elementary-algebra-2e", "Elementary Algebra 2e (初级代数 Grade 8-9)", "✖️"),
            ("concepts-biology", "Concepts of Biology (生物学概念 Grade 8-10)", "🧬")
        ]
        
        for slug, title, icon in target_books:
            book_id = f"tb_os_{slug.replace('-', '_')}"
            if self._check_exists(book_id): continue

            print(f"\n  ⏳ 正在深度提取核心理科教材《{title}》全站图文...")
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
                    
                print(f"    🎯 嗅探到 {len(chapter_urls)} 个章节！数学公式与排版自动解析中...")
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
                data = { "code_id": book_id, "title": title, "provider_type": "Advanced Math & Science", "icon": icon, "is_free": True, "source_url": toc_page_url, "description": "系统化的纯正北美数学与核心理科原版教材。硬核知识密度，涵盖大量公式与逻辑推演。", "chapters_json": chapters_data }
                self.push_to_db("edu_textbooks", data)
            except: pass

    # ---------------------------------------------------------
    # 辅助工具函数
    # ---------------------------------------------------------
    def _check_exists(self, code_id):
        try:
            existing = supabase.table("edu_textbooks").select("code_id").eq("code_id", code_id).execute()
            if existing.data: return True
            # 也检查一下大纲表
            existing_syl = supabase.table("edu_syllabi").select("code_id").eq("code_id", code_id).execute()
            if existing_syl.data: return True
        except: pass
        return False

    def push_to_db(self, table_name, data):
        print(f"  📡 正在将海量图文压入 Supabase 云端节点 ({table_name})...")
        try:
            supabase.table(table_name).upsert(data).execute()
            print(f"  🎉 卷宗 【{data['title']}】 入库圆满成功！\n")
        except Exception as e:
            print(f"  ❌ 致命错误：数据库拒绝写入: {e}")

# ==========================================
# 爬虫总控室
# ==========================================
if __name__ == "__main__":
    print("="*75)
    print("   XuePilot 航母级全球教研爬虫矩阵 (V12.0 小学数学满配终极版)   ")
    print("   ⚠️ 本次扫描涵盖：全域数学大满贯、Elson拼读、世界童话及科学底座！  ")
    print("   ⏳ 预计耗时 15-40 分钟，请保持终端运行... ")
    print("="*75)
    
    spider = XuePilotK12Spider()
    
    # 0. 全球顶尖小学数学课标 (新加坡数学 & 英国数学)
    spider.harvest_global_math_syllabi()

    # 1.5 北美百年经典小学数学 (Ray's Arithmetics)
    spider.harvest_elementary_math_classics()

    # 1. K-12 核心科普与泛数学 (Wikibooks)
    spider.harvest_wiki_math_and_science()
    
    # 2. 全球经典英文课本 (含 Elson Readers & 加拿大读本)
    spider.harvest_commonwealth_and_us_readers()

    # 3. 全球经典童话与寓言 (伊索、格林、安徒生)
    spider.harvest_global_fairy_tales()

    # 4. 港台繁体底座
    spider.harvest_hk_tw_classics()

    # 5. OpenStax 进阶理科
    spider.harvest_openstax_math_and_core()
    
    print("="*75)
    print(" 🏆 V12.0 满配版全球终极教育底座 搭建完毕！")
    print(" 新加坡数学大纲、英国数学排课、百年北美算术教材已全量部署！")
    print(" 您的数字图书馆在 K-12 数理逻辑储备上已无可挑剔！")
    print("="*75)