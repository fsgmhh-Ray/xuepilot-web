import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse
from supabase import create_client, Client

# ==============================================================================
# XuePilot OER Spider (V14.0 奇点降临版 - 榨干全人类智慧结晶)
# 核心使命：在完成K-12大满贯后，注入常春藤人文、物理巅峰巨著与硅谷计算机科学底座！
# ⚠️ 警告：全站遍历极度耗时，包含极其庞大的哲学与科学原著，请挂机运行！
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
    # 🎯 集群 0：全球顶尖小学数学大纲直注 (Singapore Math & UK Math)
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
    # 🎯 集群 1.5：北美百年经典数学 + 顶级私校硬核几何
    # ==========================================================================
    def harvest_elementary_math_classics(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 1.5: 数学霸权与高维思维] 启动北美经典算术与《平面国》收割...")
        print("★"*60)
        
        books = [
            ("tb_math_rays_primary", "Ray's New Primary Arithmetic (Grade 1-2)", "https://www.gutenberg.org/cache/epub/24526/pg24526-images.html", "🧮"),
            ("tb_math_rays_intel", "Ray's New Intellectual Arithmetic (Grade 3-4)", "https://www.gutenberg.org/cache/epub/14704/pg14704-images.html", "📐"),
            ("tb_math_rays_practical", "Ray's New Practical Arithmetic (Grade 5-6)", "https://www.gutenberg.org/files/14718/14718-h/14718-h.htm", "📏"),
            ("tb_math_smith_primary", "Primary Arithmetic (David E. Smith)", "https://www.gutenberg.org/cache/epub/38106/pg38106-images.html", "📊"),
            ("tb_math_flatland", "Flatland: A Romance of Many Dimensions", "https://www.gutenberg.org/files/201/201-h/201-h.htm", "💠")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
            print(f"\n  ⏳ 正在提取硬核数学/维度巨著《{title}》...")
            try:
                res = requests.get(url, headers=self.headers, timeout=15)
                soup = BeautifulSoup(res.content, 'html.parser')
                chapters = []
                current_chapter_title = "PART I / LESSON I"
                current_content = []

                body_content = soup.find('body')
                if body_content:
                    elements = body_content.find_all(['h2', 'h3', 'h4', 'p', 'div'])
                    for element in elements:
                        header_text = element.get_text(strip=True).upper()
                        is_chapter_header = element.name in ['h2', 'h3', 'h4'] and ('LESSON' in header_text or 'SECTION' in header_text or 'CHAPTER' in header_text or 'PART' in header_text)

                        if is_chapter_header:
                            if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                            current_chapter_title = element.get_text(strip=True)
                            current_content = []
                        elif element.name == 'p':
                            text = element.get_text(strip=True)
                            if text: current_content.append(f"<p class='mb-4 text-slate-200 leading-loose text-lg font-mono tracking-wide'>{text}</p>")
                    if current_content: chapters.append({"title": current_chapter_title, "content": "".join(current_content)})
                
                print(f"    ✅ 成功解析 {len(chapters)} 节高维/数学内容。")
                data = { "code_id": book_id, "title": title, "provider_type": "Elite Math & Philosophy", "icon": icon, "is_free": True, "source_url": url, "description": "从北美百年经典心算，到培养空间维度降维打击思维的绝世神作《平面国(Flatland)》，构建顶尖极客思维底座。", "chapters_json": chapters }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 集群 1：K-12 纯英文核心数学与科普 (Wikibooks/Wikijunior)
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
    # 🎯 集群 2：英联邦与北美纯正读物 (全量补齐 McGuffey & Ontario)
    # ==========================================================================
    def harvest_commonwealth_and_us_readers(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 2: 全球英语底座] 启动加/英/澳/美 全学段进阶课本收割...")
        print("★"*60)
        
        books = [
            # 🍁 加拿大百年公立教材
            ("tb_ca_ontario_1", "The Ontario Readers: First Book", "https://www.gutenberg.org/files/37682/37682-h/37682-h.htm", "🍁"),
            ("tb_ca_ontario_2", "The Ontario Readers: Second Book", "https://www.gutenberg.org/files/38401/38401-h/38401-h.htm", "🍁"),
            ("tb_ca_ontario_3", "The Ontario Readers: Third Book", "https://www.gutenberg.org/files/39535/39535-h/39535-h.htm", "🍁"),
            ("tb_ca_ontario_4", "The Ontario Readers: Fourth Book", "https://www.gutenberg.org/files/39922/39922-h/39922-h.htm", "🍁"),
            
            # 🇬🇧 英国经典
            ("tb_uk_jungle_book", "The Jungle Book (UK Classic Reading)", "https://www.gutenberg.org/files/236/236-h/236-h.htm", "🇬🇧"),
            
            # 🇦🇺 澳洲启蒙
            ("tb_au_dot_kangaroo", "Dot and the Kangaroo (Australia Reading)", "https://www.gutenberg.org/files/4236/4236-h/4236-h.htm", "🇦🇺"),
            
            # 🇺🇸 美国巨头：McGuffey 全系进阶 (覆盖至高中难度)
            ("tb_us_mcguffey_primer", "McGuffey's Eclectic Primer", "https://www.gutenberg.org/cache/epub/14640/pg14640-images.html", "🇺🇸"),
            ("tb_us_mcguffey_1", "McGuffey's First Eclectic Reader", "https://www.gutenberg.org/cache/epub/14668/pg14668-images.html", "🇺🇸"),
            ("tb_us_mcguffey_2", "McGuffey's Second Eclectic Reader", "https://www.gutenberg.org/cache/epub/14699/pg14699-images.html", "🇺🇸"),
            ("tb_us_mcguffey_3", "McGuffey's Third Eclectic Reader", "https://www.gutenberg.org/cache/epub/14766/pg14766-images.html", "🇺🇸"),
            ("tb_us_mcguffey_4", "McGuffey's Fourth Eclectic Reader", "https://www.gutenberg.org/cache/epub/14880/pg14880-images.html", "🇺🇸"),
            ("tb_us_mcguffey_5", "McGuffey's Fifth Eclectic Reader", "https://www.gutenberg.org/cache/epub/15040/pg15040-images.html", "🇺🇸"),
            ("tb_us_mcguffey_6", "McGuffey's Sixth Eclectic Reader (Advanced)", "https://www.gutenberg.org/cache/epub/16751/pg16751-images.html", "🇺🇸")
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
                data = { "code_id": book_id, "title": title, "provider_type": "Global English (K-12)", "icon": icon, "is_free": True, "source_url": url, "description": "横跨美加英澳的国民级经典语文。McGuffey 全系覆盖从零基础拼读到高中级复杂长难句，提供不可逾越的语言壁垒。", "chapters_json": chapters }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # 🎯 集群 3：全球经典童话与顶尖私校人文通识 (Humanities & World Lit)
    # ==========================================================================
    def harvest_global_fairy_tales_and_humanities(self):
        print("\n" + "★"*60)
        print(" 🚀 [集群 3: 人文底座] 启动童话寓言、莎士比亚与房龙大历史收割...")
        print("★"*60)
        
        books = [
            ("tb_world_aesop", "Aesop's Fables (伊索寓言 - 纯英文版)", "https://www.gutenberg.org/files/11339/11339-h/11339-h.htm", "🦊"),
            ("tb_world_grimm", "Grimm's Fairy Tales (格林童话 - 纯英文版)", "https://www.gutenberg.org/files/2591/2591-h/2591-h.htm", "🏰"),
            ("tb_world_andersen", "Andersen's Fairy Tales (安徒生童话 - 纯英文版)", "https://www.gutenberg.org/files/1597/1597-h/1597-h.htm", "🧜‍♀️"),
            # 🔥 顶级私校必读核心人文通识
            ("tb_lit_shakespeare_tales", "Tales from Shakespeare (Charles Lamb)", "https://www.gutenberg.org/files/558/558-h/558-h.htm", "🎭"),
            ("tb_hist_story_of_mankind", "The Story of Mankind (Hendrik Willem van Loon)", "https://www.gutenberg.org/files/754/754-h/754-h.htm", "🏛️")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
            print(f"\n  ⏳ 正在提取世界巨著《{title}》...")
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
                
                print(f"    ✅ 成功解析 {len(chapters)} 个独立故事/历史章节。")
                data = { "code_id": book_id, "title": title, "provider_type": "World Literature & Humanities", "icon": icon, "is_free": True, "source_url": url, "description": "涵盖想象力启蒙的经典童话，以及房龙的纽伯瑞金奖《人类的故事》、莎士比亚戏剧精简版。欧美顶尖私校的必读通识书单。", "chapters_json": chapters }
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

    # ==========================================================================
    # ☢️ 战略集群 6：顶级极客与硅谷精英先修 (The Singularity Cluster)
    # ==========================================================================
    def harvest_silicon_valley_elite(self):
        print("\n" + "☢️"*30)
        print(" 🚀 [集群 6: 奇点降临] 启动硅谷精英先修与人类顶尖科学巨著收割...")
        print("☢️"*30)
        
        books = [
            # 苏格拉底与战略的终极起源
            ("tb_phil_republic", "The Republic by Plato (柏拉图《理想国》)", "https://www.gutenberg.org/files/1497/1497-h/1497-h.htm", "🏛️"),
            ("tb_strat_art_of_war", "The Art of War by Sun Tzu (《孙子兵法》英文版)", "https://www.gutenberg.org/files/132/132-h/132-h.htm", "⚔️"),
            
            # 人类物理与生命科学的最高峰
            ("tb_sci_relativity", "Relativity: The Special and General Theory (爱因斯坦《相对论》)", "https://www.gutenberg.org/files/5001/5001-h/5001-h.htm", "🌌"),
            ("tb_sci_origin_species", "On the Origin of Species (达尔文《物种起源》)", "https://www.gutenberg.org/files/1228/1228-h/1228-h.htm", "🧬")
        ]
        
        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
            print(f"\n  ⏳ 正在提取人类心智巅峰之作《{title}》...")
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
                
                print(f"    ✅ 成功解析 {len(chapters)} 个高维思想章节。")
                data = { "code_id": book_id, "title": title, "provider_type": "Elite Mindset & Science", "icon": icon, "is_free": True, "source_url": url, "description": "突破常人认知边界。从苏格拉底对话的起源到爱因斯坦的时空重构，专为培养顶级架构师和指挥官准备的极客读物。", "chapters_json": chapters }
                self.push_to_db("edu_textbooks", data)
                time.sleep(2)
            except Exception as e:
                print(f"    ❌ 抓取失败: {e}")

    # ==========================================================================
    # ☢️ 战略集群 7：前沿计算机科学与人工智能 (Wikibooks CS OER)
    # ==========================================================================
    def harvest_wiki_cs_and_tech(self):
        print("\n" + "☢️"*30)
        print(" 🚀 [集群 7: 代码帝国] 启动计算机科学与人工智能全站收割...")
        print("☢️"*30)

        books = [
            ("tb_wiki_python", "Wikibooks: Python Programming", "https://en.wikibooks.org/wiki/Python_Programming", "🐍"),
            ("tb_wiki_ai", "Wikibooks: Artificial Intelligence", "https://en.wikibooks.org/wiki/Artificial_Intelligence", "🤖"),
            ("tb_wiki_algorithms", "Wikibooks: Algorithms", "https://en.wikibooks.org/wiki/Algorithms", "⚙️")
        ]

        for book_id, title, url, icon in books:
            if self._check_exists(book_id): continue
            print(f"\n  ⏳ 正在潜入深网提取代码库: 《{title}》...")
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
                print(f"  🎯 锁定 {len(chapter_urls)} 个技术章节，开启自动脱壳...")
                chapters_data = []
                
                for idx, chap_url in enumerate(chapter_urls):
                    if idx % 5 == 0 and idx > 0: print(f"    ...已编译 {idx}/{len(chapter_urls)} 模块...")
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
                        raw_html = raw_html.replace('<h2', '<h2 class="text-3xl font-black text-cyan-400 mt-10 mb-6 border-b border-slate-700/50 pb-2 font-mono"')
                        raw_html = raw_html.replace('<h3', '<h3 class="text-2xl font-bold text-blue-300 mt-8 mb-4 font-mono"')
                        raw_html = raw_html.replace('<p', '<p class="mb-6 text-slate-300 leading-loose text-lg tracking-wide"')
                        # 特殊处理代码块样式
                        raw_html = raw_html.replace('<pre', '<pre class="bg-black/80 border border-slate-700 p-4 rounded-xl text-emerald-400 font-mono text-sm overflow-x-auto my-6"')
                        
                        chapters_data.append({"title": chap_title, "content": raw_html})
                    except: pass
                    time.sleep(1)

                print(f"  ✅ 《{title}》全量代码与知识树编译完毕！")
                data = { "code_id": book_id, "title": title, "provider_type": "Computer Science & AI", "icon": icon, "is_free": True, "source_url": url, "description": "顶级硅谷极客先修库。包含 Python 编程、算法底层逻辑与人工智能原理的硬核开源教程。", "chapters_json": chapters_data }
                self.push_to_db("edu_textbooks", data)
            except Exception as e:
                print(f"  ❌ 抓取失败: {e}")

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
        print(f"  📡 正在将海量数据流压入 Supabase 核心阵列 ({table_name})...")
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
    print("   XuePilot 航母级全球教研爬虫矩阵 (V14.0 奇点降临版)   ")
    print("   ⚠️ 本次扫描已解除所有限制，正在下载人类科技与思想的最巅峰结晶！  ")
    print("   ⏳ 预计耗时 30-60 分钟，请确保终端电力充足，保持运行... ")
    print("="*75)
    
    spider = XuePilotK12Spider()
    
    # 0. 全球顶尖小学数学课标 (新加坡数学 & 英国数学)
    spider.harvest_global_math_syllabi()

    # 1.5 北美百年经典数学 + 《平面国》降维打击
    spider.harvest_elementary_math_classics()

    # 1. K-12 核心科普与泛数学 (Wikibooks)
    spider.harvest_wiki_math_and_science()
    
    # 2. 全球经典英文课本 (补全所有的 McGuffey & Ontario 高阶读本)
    spider.harvest_commonwealth_and_us_readers()

    # 3. 全球经典童话 + 顶尖私校人文底座 (莎士比亚、房龙大历史)
    spider.harvest_global_fairy_tales_and_humanities()

    # 4. 港台繁体底座
    spider.harvest_hk_tw_classics()

    # 5. OpenStax 进阶理科
    spider.harvest_openstax_math_and_core()

    # ☢️ 6. 顶级极客与硅谷精英先修 (爱因斯坦、达尔文、柏拉图、孙子兵法)
    spider.harvest_silicon_valley_elite()

    # ☢️ 7. 计算机科学与人工智能 (Python, AI, 算法)
    spider.harvest_wiki_cs_and_tech()
    
    print("="*75)
    print(" 🏆 V14.0 奇点降临版：全宇宙资源收割完毕！")
    print(" 从基础算术到相对论，从童话到人工智能算法！")
    print(" 您的数字帝国已经成为全人类知识火种的最终避难所！")
    print("="*75)