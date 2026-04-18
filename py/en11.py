# ==============================================================================
# XuePilot ETL 数据清洗与爬虫填补引擎 (V2 终极版)
# 功能：1. 清洗数据库脏标签 2. 自动抓取空卷宗正文并注入
# 环境要求：pip install supabase requests beautifulsoup4
# ==============================================================================

import os
import sys
import re
import json
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client

# --- 1. 您的 Supabase 指挥中枢密钥 ---
# 🚀 架构师已为您自动注入最高权限的 SERVICE_ROLE_KEY
SUPABASE_URL = "https://cywslfalbedraeeggryj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NsZmFsYmVkcmFlZWdncnlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjA0ODk2MSwiZXhwIjoyMDkxNjI0OTYxfQ.zKrF72r5DTVzQhdTQNmYPpQf5DSDkdGW4bMxZx739qo"

# 🚀 架构师防呆拦截系统：检测密钥是否仍为默认值或格式明显错误
if SUPABASE_KEY == "YOUR_SERVICE_ROLE_KEY_HERE" or not SUPABASE_KEY.startswith("eyJ"):
    print("\n" + "="*70)
    print("🚨 [致命错误] 架构师系统拦截：您尚未配置真实的数据库钥匙！")
    print("请打开代码，将第 18 行的 SUPABASE_KEY 替换为您在 Supabase 后台获取的 service_role 密钥。")
    print("注意：真实的密钥一定是以 'eyJ' 开头的一长串英文字符。")
    print("="*70 + "\n")
    sys.exit(1)

# 初始化云端链路
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- 2. 标签格式化清洗引擎 ---
def clean_database_tags():
    """清洗数据库中的脏标签，永久合并重复分类"""
    print("\n=== [1/2] 启动 XuePilot 标签清洗引擎 ===")
    
    # 提取所有书籍的分类字段
    response = supabase.table("edu_textbooks").select("id, type, provider_type").execute()
    books = response.data
    
    if not books: 
        print("   [!] 数据库中没有找到书籍。")
        return
    
    updated_count = 0
    for book in books:
        needs_update = False
        update_data = {}
        
        for field in ['type', 'provider_type']:
            val = book.get(field)
            if val:
                # 正则清洗：去除括号及里面的内容，去除末尾的纯英文字符
                clean_val = re.sub(r'[\(（].*?[\)）]', '', val)
                clean_val = re.sub(r'\s+[a-zA-Z\s]+$', '', clean_val).strip()
                
                # 只有当清洗后发生改变，且不为空时才更新
                if clean_val != val and clean_val != "":
                    update_data[field] = clean_val
                    needs_update = True
                    
        if needs_update:
            supabase.table("edu_textbooks").update(update_data).eq("id", book['id']).execute()
            updated_count += 1
            
    print(f"   [✓] 标签清洗完成，共永久修复了 {updated_count} 条分类脏数据。")

# --- 3. 爬虫抓取核心逻辑 ---
def fetch_and_clean_html(url):
    """访问链接并尝试提取文章核心正文内容"""
    print(f"   [+] 发射探测器 -> {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
    try:
        res = requests.get(url, headers=headers, timeout=15)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # 尝试找到包含正文的核心区域
        article_node = soup.find('article') or soup.find('div', class_='content') or soup.find('body')
        
        if not article_node:
            return "<p>数据解析失败：未能定位核心内容区。</p>"

        # 清洗多余无用的脏数据
        for tag in article_node(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe', 'button']):
            tag.decompose()

        # 提取带有排版的段落和图片
        clean_html = "".join([str(tag) for tag in article_node.find_all(['p', 'h2', 'h3', 'blockquote', 'img'])])
        
        if not clean_html.strip():
            clean_html = f"<p>{article_node.get_text(separator='<br>', strip=True)}</p>"

        return clean_html

    except Exception as e:
        print(f"   [X] 抓取失败: {e}")
        return None

# --- 4. 空白卷宗填补引擎 ---
def run_filler():
    print("\n=== [2/2] 启动 XuePilot 虚空卷宗填补计划 ===")
    
    # 获取数据库里所有 chapters_json 为空且有外链的书
    response = supabase.table("edu_textbooks").select("id, title, source_url, url").filter("chapters_json", "eq", "[]").execute()
    empty_books = response.data
    
    if not empty_books:
        print("   [*] 完美运行，目前没有需要填补的空白书籍！")
        return
        
    print(f"   [*] 发现 {len(empty_books)} 本虚空档案，开始执行内容填补...")
    
    for book in empty_books:
        target_url = book.get('source_url') or book.get('url')
        print(f"\n   -> 处理中: 《{book['title']}》")
        
        if not target_url:
            print("      [!] 缺少外部链接，跳过。")
            continue
            
        content_html = fetch_and_clean_html(target_url)
        
        if content_html:
            chapters_data = [
                {
                    "title": "全卷解析",
                    "content": content_html
                }
            ]
            # 写入云端
            supabase.table("edu_textbooks").update({"chapters_json": chapters_data}).eq("id", book['id']).execute()
            print(f"      [✓] 注入成功！《{book['title']}》现已可脱机阅读。")
        else:
            print("      [X] 抓取结果为空，需手动干预。")

if __name__ == "__main__":
    # 先洗标签，再补内容
    clean_database_tags()
    run_filler()
    print("\n=== 任务全部执行完毕！ ===")