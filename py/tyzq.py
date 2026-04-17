import requests
from bs4 import BeautifulSoup
import json
import time
from supabase import create_client, Client

# ==========================================
# XuePilot OER Spider (V3.0 工业级自动化框架版)
# 作用：真正的全量爬虫框架，利用循环遍历所有年级与章节，彻底告别硬编码！
# ==========================================

# ✅ 您的 Supabase 链接与 Service Role Key
SUPABASE_URL = "https://cywslfalbedraeeggryj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA0ODk2MSwiZXhwIjoyMDkxNjI0OTYxfQ.zKrF72r5DTVzQhdTQNmYPpQf5DSDkdGW4bMxZx739qo" 

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class XuePilotGlobalSpider:
    def __init__(self):
        # 伪装成真实浏览器，防止被目标网站的反爬虫机制拦截
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    # ---------------------------------------------------------
    # 核心方法 1：全量大纲爬取器 (自动化遍历所有年级和科目)
    # ---------------------------------------------------------
    def scrape_full_syllabus(self, region_name, base_url, subjects, grades):
        print(f"🚀 开始全量抓取【{region_name}】教育大纲...")
        
        full_structure = []
        
        # 真正的爬虫是不写死年级的！我们用双重 for 循环遍历所有的科目和所有的年级
        for subject in subjects:
            print(f"  正在解析学科: {subject}...")
            subject_data = {"subject": subject, "icon": "📚", "grades": []}
            
            for grade in grades:
                print(f"    正在抓取: {grade}...")
                
                # 构造真实的请求 URL (这里以通用 URL 参数为例)
                # 例如: https://example-edu.gov/api/syllabus?subject=Math&grade=4
                target_url = f"{base_url}?subject={subject}&grade={grade}"
                
                try:
                    # 发起真实的 HTTP 请求获取网页内容
                    response = requests.get(target_url, headers=self.headers)
                    # 如果目标网站是返回 JSON (很多教育部官网是这样)
                    # data = response.json() 
                    
                    # 如果目标网站是 HTML，使用 BeautifulSoup 解析
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # === 以下为您需要根据具体网站修改的真实提取逻辑 ===
                    # term_elements = soup.find_all('div', class_='term-container')
                    # ... 解析提取 terms, modules, hours, objectives ...
                    
                    # 这里为了框架能跑通，用结构化变量代替解析出的真实结果
                    parsed_terms = [] # 应该是由 soup 解析出的真实学期数组
                    
                    grade_data = {
                        "grade": grade,
                        "terms": parsed_terms
                    }
                    subject_data["grades"].append(grade_data)
                    
                    # 礼貌性延时，防止把对方服务器爬崩
                    time.sleep(1)
                    
                except Exception as e:
                    print(f"    ❌ 抓取 {subject} {grade} 时出错: {e}")
            
            full_structure.append(subject_data)
            
        return {
            "code_id": f"sb_{region_name}_full",
            "title": f"{region_name} 完整全学段大纲",
            "region": region_name,
            "icon": "🌐",
            "is_free": False,
            "description": f"由 XuePilot Spider 全量抓取的 {region_name} K-12 完整排课矩阵。",
            "structure_json": full_structure
        }

    # ---------------------------------------------------------
    # 核心方法 2：整本教材爬取器 (自动抓取目录并遍历所有章节)
    # ---------------------------------------------------------
    def scrape_full_textbook(self, book_id, book_title, index_url):
        print(f"🚀 开始抓取整本教材图文：{book_title}...")
        
        chapters_data = []
        
        try:
            # 1. 抓取教材的目录页 (Table of Contents)
            res_index = requests.get(index_url, headers=self.headers)
            soup_index = BeautifulSoup(res_index.text, 'html.parser')
            
            # 2. 找到所有章节的链接 (假设链接在 <a class="chapter-link"> 中)
            chapter_links = []
            # links = soup_index.find_all('a', class_='chapter-link')
            # for link in links:
            #     chapter_links.append(link['href'])
            
            print(f"  解析到目录，共发现 {len(chapter_links)} 个章节。开始逐章抓取...")
            
            # 3. 循环遍历抓取每一个章节的具体内容，绝不遗漏！
            for i, chap_url in enumerate(chapter_links):
                print(f"    正在抓取第 {i+1} 章...")
                res_chap = requests.get(chap_url, headers=self.headers)
                soup_chap = BeautifulSoup(res_chap.text, 'html.parser')
                
                # 提取章节标题和正文内容 (带 HTML 排版)
                # title = soup_chap.find('h1', class_='title').text
                # content = str(soup_chap.find('div', class_='content-body'))
                
                # chapters_data.append({"title": title, "content": content})
                time.sleep(1.5) # 防止被反爬
                
        except Exception as e:
            print(f"❌ 抓取教材失败: {e}")
            
        return {
            "code_id": book_id,
            "title": book_title,
            "provider_type": "自动化入库",
            "icon": "📖",
            "is_free": True,
            "description": f"完整抓取自 {index_url} 的电子教材。",
            "source_url": index_url,
            "chapters_json": chapters_data 
        }

    # ---------------------------------------------------------
    # 数据推送到 Supabase
    # ---------------------------------------------------------
    def push_to_db(self, table_name, data):
        if not data.get('structure_json') and not data.get('chapters_json') and not data.get('source_url'):
            print(f"⚠️ 数据为空，跳过入库: {data['title']}")
            return

        print(f"📡 正在将 {data['title']} 写入 Supabase [{table_name}]...")
        try:
            supabase.table(table_name).upsert(data).execute()
            print(f"✅ 入库成功！")
        except Exception as e:
            print(f"❌ 写入数据库失败: {e}")

# ==========================================
# 执行总控室
# ==========================================
if __name__ == "__main__":
    print("=== XuePilot 工业级爬虫矩阵已启动 ===")
    
    spider = XuePilotGlobalSpider()
    
    # 任务 1：抓取美国大纲 (定义所有的科目和年级，让爬虫去跑)
    us_subjects = ["Mathematics", "English Language Arts", "Science", "Social Studies"]
    us_grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"]
    
    # 启动全量抓取 (取消下方注释并填入真实目标接口即可运行)
    # us_syllabus_data = spider.scrape_full_syllabus("美国 CCSS", "https://example-edu-api.gov/standards", us_subjects, us_grades)
    # spider.push_to_db("edu_syllabi", us_syllabus_data)
    
    # 任务 2：抓取一本完整的教材
    # textbook_data = spider.scrape_full_textbook("tb_openstax_bio", "OpenStax Biology 2e", "https://openstax.org/books/biology-2e/pages/1-introduction")
    # spider.push_to_db("edu_textbooks", textbook_data)
    
    print("=== 请根据实际网站的 DOM 结构补全 BeautifulSoup 提取逻辑，即可实现海量自动化入库 ===")