function ShowMenu(index) {
    var title_img;
    var content;
    
    switch(index) {
    case 1: // 資訊中心
        title_img = 'box_header_info.jpg';
        content = [
            [0, '活動專區'],
            [1, 'resource_2.html', 'NativeCn 嘸蝦米序號申請'],
            [1, 'resource_4.html', 'WM 嘸蝦米序號申請'],
            [0, '有關行易'],
            [1, 'news.html#news',  '蝦米消息'],
            [1, 'about.html',      '行易有限公司-介紹'],
            [1, 'think.html',      '老酋長園地']
        ];
    
        break;
    case 2: // 資訊中心 - 老酋長園地
        title_img = 'box_header_info.jpg';
        content = [
            [0, '活動專區'],
            [1, 'resource_2.html', 'NativeCn 嘸蝦米序號申請'],
            [1, 'resource_4.html', 'WM 嘸蝦米序號申請'],
            [0, '有關行易'],
            [1, 'news.html',  '蝦米消息'],
            [1, 'about.html', '行易有限公司-介紹'],
            [1, 'think.html', '老酋長園地'],
            [2, [
                    [1, 'think_1.html', '鳥戲'],
                    [1, 'think_2.html', '奠基'],
                    [1, 'think_3.html', '斯土斯民']
                ]
            ]
        ];
    
        break;
    case 3: // 產品介紹
        title_img = 'box_header_product.jpg';
        content = [
            [1, 'liu70.html','7.0版新功能介紹'],
            [1, 'product.html#products','產品總覽'],
            [1, 'product.html#update', '舊版本更新說明'],
            [1, 'product.html#version', '嘸蝦米版本區別'],
            [1, 'product_1.html',       '嘸蝦米相關產品']
        ];
    
        break;
    case 4: // 購買方式
        title_img = 'box_header_purchase.jpg';
        content = [
            [1, 'purchase_1.html','實體通路'],
            [1, 'purchase_2.html','虛擬通路'],
            [1, 'purchase_3.html','宅配到府'],
            [1, 'purchase_4.html','海外購買辦法'],
            [1, 'purchase_5.html','大量授權方案']
        ];
    
        break;
    case 5: // 購買方式 - 實體通路
        title_img = ' box_header_purchase.jpg';
        content = [
            [1, 'purchase_1.html','實體通路'],
            [2, [
                    [1, 'purchase_1_3.html', '光華數位新天地'],
                    [1, 'purchase_1_2.html', '電腦賣場'],
                    [1, 'purchase_1_1.html', '全省各大書局']
                ]
            ],
            [1, 'purchase_2.html','虛擬通路'],
            [1, 'purchase_3.html','宅配到府'],
            [1, 'purchase_4.html','海外購買辦法'],
            [1, 'purchase_5.html','大量授權方案']
        ];
    
        break;
    case 6: // 蝦米教學
        title_img = ' box_header_learn.jpg';
        content = [
            [0, '為什麼要學習嘸蝦米'],
            [1, 'whybosh_4.html','史上最強輸入法'],
            [1, 'whybosh_1.html','什麼是中文輸入法'],
            [3, '<a href="whybosh_2.html">如何選擇</a><span style="font-size:70%"> (<a href="whybosh_2.html">一</a>, <a href="whybosh_2_1.html">二</a>, <a href="whybosh_2_2.html">三</a>)</span>'],
            [1, 'whybosh_3.html','使用者推薦'],

            [0, '學習流程'],
            [1, 'learn_how.html','學習流程'],

            [0, '入門篇'],
            [1, 'learn_1_1.html','摘要說明'],
            [3, '<a href="learn_1_2.html">字根易學篇</a> <span style="font-size:70%">(<a href="learn_1_2.html">形</a>, <a href="learn_1_2_1.html">音</a>, <a href="learn_1_2_2.html">義</a>, <a href="learn_1_2_3.html">其它</a>)</span>'],
            [1, 'learn_1_3.html','字根總表'],
            [3, '<a href="learn_1_4.html">符號表格</a> <span style="font-size:70%">(<a href="learn_1_4.html">注音日文</a>, <a href="learn_1_4_1.html">其它</a>)</span>'],

            [0, '進階篇'],
            [1, 'learn_2_3.html','簡速字根總表'],
            [3, '<a href="learn_2_1.html">兩碼字分類</a> <span style="font-size:70%">(<a href="learn_2_1.html">一</a>, <a href="learn_2_1_1.html">二</a>, <a href="learn_2_1_2.html">三</a>, <a href="learn_2_1_3.html">四</a>)</span>'],
            [1, 'learn_2_2.html','兩碼字表'],
            [1, 'learn_2_6.html','兩碼字聯想記憶法'],
            

            [0, '功能篇'],
            [1, 'learn_1_5.html','查碼功能'],
            [1, 'learn_2_4_2.html','加字加詞'],
            [1, 'learn_2_4.html','多國語言切換'],

            [0, '經驗釋疑'],
            [1, 'learn_1_6.html','經驗釋疑']
        ];

        break;
    case 7: // 線上資源
        title_img = 'box_header_resource.jpg';
        content = [
            [1, 'resource_1.html',  '線上嘸蝦米'],
            [1, 'resource_3.php',   '線上嘸蝦米查碼程式'],
            [3, '<a href="http://boshiamy.com/blog/" target="_blank">嘸蝦米部落格</a>'],
            
        ];
    
        break;
    case 8: // 檔案下載
        title_img = 'box_header_download.jpg';
        content = [
            [1, 'download.html#portable', '嘸蝦米【免安裝】試用版'],
            [1, 'download.html#trial',    '嘸蝦米多國語言試用版'],
            [1, 'download.html#ezliu',    '輕鬆學會嘸蝦米'],
            [1, 'download.html#quickliu', '嘸蝦米快打'],
            [1, 'download.html#unliu',    '嘸蝦米反安裝程式'],
            [1, 'download.html#liucns',   '找怪字、查注音'],
            [1, 'download.html#phrase',   '嘸蝦米詞庫套件試用版'],
            
            [0, '註冊會員下載專區'],
            [1, 'member_download.php',    '嘸蝦米 Unix-like 適用版'],
            
        ]
            
        break;
    case 9: // 客戶服務
        title_img = 'box_header_contact.jpg';
        content = [
            [1, 'contact_mail.html', '嘸蝦米客服中心'],
            [1, 'faq.html',          'FAQ 常見問題說明'],
            [1, 'contact.html',      '我們的聯絡方式']
        ]
            
        break;
        
     case 9.1: // 會員註冊
        title_img = 'box_header_contact_1.jpg';
        content = [
            [1, 'register.html', '註冊新會員區'],
             
        ]
            
        break;    
        
    }

    document.writeln  ('<div class="box">');
    document.writeln  ('    <h3><img src="' + title_img + '"></h3>');

    document.writeln  ('    <div class="context">');
    document.writeln  ('        <ul>');
    
    for(c in content) {
        switch(content[c][0]) {
        case 0:
            document.writeln('</ul><h4>' + content[c][1] + '</h4><ul>');
            break;
        case 1:
            document.writeln  ('    <li><a href="' + content[c][1] + '">' + content[c][2] + '</a></li>');
            break;
        case 2:
            document.writeln  ('    <ul>');
            for(cc in content[c][1]) {
                document.writeln  ('    <li><a href="' + content[c][1][cc][1] + '">' + content[c][1][cc][2] + '</a></li>');
            }
            document.writeln  ('    </ul>');
            
            break;
        case 3:
            document.writeln  ('    <li>' + content[c][1] + '</li>');
            break;
        }
    }
    
    document.writeln  ('        </ul>');
    document.writeln  ('    </div>');
    document.writeln  ('</div>');
}
