-- =========================================================================
-- XuePilot Global Edu-Vault 数据库初始化与海量资源注入脚本 (V1.0)
-- 作用：建立全球大纲、开源教材、交互式探索站点的底层数据库
-- 使用方法：直接在 Supabase -> SQL Editor 中运行此脚本
-- =========================================================================

-- =====================================
-- 第一部分：建立数据表结构
-- =====================================

-- 1. 核心课标大纲库 (Syllabi Vault)
CREATE TABLE IF NOT EXISTS public.edu_syllabi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id TEXT UNIQUE NOT NULL, -- 如 sb_us_ccss_math
    title TEXT NOT NULL,
    region TEXT NOT NULL, -- 如 美国, 英国, 中国
    icon TEXT NOT NULL DEFAULT '📚',
    is_free BOOLEAN DEFAULT FALSE, -- 控制是否需要 PRO 权限
    description TEXT,
    structure_json JSONB DEFAULT '[]'::jsonb, -- 存储章节树的预定义JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. 全球开源教材库 (Open Textbooks)
CREATE TABLE IF NOT EXISTS public.edu_textbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    provider_type TEXT NOT NULL, -- 如 开源体系, 数字底座, 机构教研
    icon TEXT NOT NULL DEFAULT '📖',
    is_free BOOLEAN DEFAULT FALSE,
    description TEXT,
    source_url TEXT, -- 外部链接或内部存储桶链接
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. 权威认知探索站点 (Portals)
CREATE TABLE IF NOT EXISTS public.edu_portals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL DEFAULT '🔭',
    category TEXT, -- 如 STEM, Coding, Language
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =====================================
-- 第二部分：注入海量真实世界教育资源
-- =====================================

-- 🌟 注入：核心课标大纲 (Syllabi)
INSERT INTO public.edu_syllabi (code_id, title, region, icon, is_free, description)
VALUES 
    -- 免费体验区
    ('sb_cn_2022_zh', '义务教育语文课程标准 (2022版)', '中国', '🇨🇳', TRUE, '中国教育部最新发布：聚焦中华优秀传统文化传承、跨学科学习与整本书阅读体系。'),
    ('sb_us_ccss_math', 'Common Core State Standards (CCSS) - Math', '美国', '🇺🇸', TRUE, '全美核心州立标准：强化分数的几何理解、代数思维与多维数学模型架构。'),
    
    -- PRO 权限区 (北美)
    ('sb_us_ngss', 'NGSS (Next Generation Science Standards)', '美国', '🧪', FALSE, '下一代科学标准：物理、生命与地球科学的三维交叉融合框架，强调工程实践。'),
    ('sb_ca_ontario', 'Ontario Curriculum (Science & Tech)', '加拿大', '🍁', FALSE, '加拿大安大略省素养大纲：侧重于生物多样性、太空科技与环境保护的探究式学习。'),
    
    -- PRO 权限区 (欧洲)
    ('sb_uk_ks2_comp', 'National Curriculum KS2 Computing', '英国', '🇬🇧', FALSE, '英国国家大纲 Key Stage 2：算法逻辑、布尔运算与计算机科学先导方案。'),
    ('sb_uk_ks3_sci', 'National Curriculum KS3 Science', '英国', '🇬🇧', FALSE, '涵盖遗传学、化学反应动力学与能量守恒的英式严谨科学框架。'),
    ('sb_fi_phenobl', 'Phenomenon-Based Learning (PhenoBL)', '芬兰', '🇫🇮', FALSE, '芬兰现象式教学法：打破传统学科边界，以真实世界现象(如气候变化)为驱动的模块化排课。'),
    
    -- PRO 权限区 (亚洲及国际)
    ('sb_sg_moe_sci', 'Singapore MOE Syllabus - Science', '新加坡', '🇸🇬', FALSE, '享誉全球的科学探究大纲：基于生命周期与多样性的现象式启发体系。'),
    ('sb_sg_moe_math', 'Singapore MOE Syllabus - Math', '新加坡', '🇸🇬', FALSE, '以 C-P-A (具体-图像-抽象) 建模法为核心的新加坡数学教学大纲。'),
    ('sb_tw_108', '108课纲 - 自然科学领域', '台湾', '🇹🇼', FALSE, '台湾 108 素养导向课纲：跨领域探究、实作计划与科学态度养成。'),
    ('sb_ib_pyp', 'IB PYP Transdisciplinary Framework', '国际', '🌐', FALSE, '国际文凭组织小学项目：围绕“我们是谁”、“我们身处何时何地”等六大超学科主题的探究框架。'),
    ('sb_ib_myp', 'IB MYP Core Integration', '国际', '🌐', FALSE, '国际文凭中学项目：强调全球背景下的概念性理解与跨学科整合。')
ON CONFLICT (code_id) DO NOTHING;

-- 🌟 注入：开源教材库 (Textbooks)
INSERT INTO public.edu_textbooks (code_id, title, provider_type, icon, is_free, description, source_url)
VALUES 
    ('tb_us_openstax', 'OpenStax K-12 OER Library', '开源体系', '📚', TRUE, '来自莱斯大学的高质量、全同行评审 K-12 数理化开源英文教材库。', 'https://openstax.org/'),
    ('tb_cn_zxx', '国家中小学智慧教育平台', '数字底座', '📱', TRUE, '中国教育部直属：人教版、部编版全学段超高清电子教材与官方课件源。', 'https://basic.smartedu.cn/'),
    ('tb_ck12_stem', 'CK-12 Foundation FlexBooks', '开源体系', '🔬', TRUE, '提供高度可定制的 STEM 数字教科书，内置丰富的互动式模拟。', 'https://www.ck12.org/'),
    ('tb_sg_marshall', 'Marshall Cavendish Education (Sample)', '教研标杆', '📐', FALSE, '“新加坡数学”全球流行教材《Targeting Math》与《My Pals Are Here》底层逻辑库预览。', NULL),
    ('tb_uk_cgp', 'CGP Primary Books Framework', '英式体系', '🇬🇧', FALSE, '英国第一教辅品牌 CGP 核心知识点图谱，提炼 KS1-KS3 备考精华。', NULL),
    ('tb_gutenberg', 'Project Gutenberg Classic Lit', '文史底座', '📜', TRUE, '超 70,000 本人类经典公版文学名著，英文原版阅读的最佳语料库。', 'https://www.gutenberg.org/')
ON CONFLICT (code_id) DO NOTHING;

-- 🌟 注入：权威探索站点 (Portals)
INSERT INTO public.edu_portals (title, url, icon, category, description)
VALUES 
    ('NASA Kids'' Club', 'https://www.nasa.gov/kidsclub/index.html', '🚀', 'STEM', '美国宇航局官方设立的儿童科学探索与太空游戏前哨站。'),
    ('PhET Simulations', 'https://phet.colorado.edu/zh_CN/', '⚛️', 'STEM', '科罗拉多大学诺奖得主创立，提供极其硬核的理化生互动仿真实验室。'),
    ('Khan Academy', 'https://zh.khanacademy.org/', '🌱', 'All', '可汗学院：硅谷顶级教育非营利组织，提供全球最强数理进阶题库。'),
    ('Scratch MIT', 'https://scratch.mit.edu/', '🐱', 'Coding', '麻省理工学院媒体实验室开发的图形化编程与创意游戏分享社区。'),
    ('NatGeo Kids', 'https://kids.nationalgeographic.com/', '🌍', 'Science', '国家地理儿童版：地球生态、动物行为学与极限地理的绝佳探索地。'),
    ('Code.org', 'https://code.org/', '💻', 'Coding', '全球最大的少儿编程普及阵地，内含《我的世界》等联名逻辑关卡。'),
    ('Brilliant.org', 'https://brilliant.org/', '🧠', 'STEM', '硅谷精英都在用的互动式思维训练：直击数学、逻辑与计算机本质。'),
    ('Desmos Graphing', 'https://www.desmos.com/calculator?lang=zh-CN', '📈', 'Math', '极其优美的在线图形计算器，将枯燥的代数方程瞬间转化为视觉艺术。'),
    ('Duolingo ABC', 'https://www.duolingo.com/', '🦉', 'Language', '全球最受欢迎的语言学习平台，将枯燥的语法转化为通关游戏。'),
    ('TED-Ed', 'https://ed.ted.com/', '🎞️', 'All', 'TED 官方教育频道，用精美的名家动画解释世界上最深奥的跨学科问题。')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 注：未来在您的后台 Dashboard 代码中，只需通过 Supabase JS Client
-- 执行 supabase.from('edu_syllabi').select('*') 即可将这些数据动态加载到前端！
-- =========================================================================