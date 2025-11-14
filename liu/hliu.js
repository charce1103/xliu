/* 標題：HLiu                          *
 * 作者：Luke Chang                    *
 * 聯絡：luke1209@gmail.com            *
 * 測試環境：WinXP + SP2, IE7.0        *
 * 建立日期：2005 年 7 月 22 日        *
 * 更新日期：2008 年 8 月  1 日        */

//判斷瀏覽器
var Browser = (navigator.appName.indexOf('Microsoft') != -1) ? 1 :
              (navigator.appName.indexOf('Netscape')  != -1) ? 2 :
              (navigator.appName.indexOf('Opera')     != -1) ? 3 :
              4;

Opera950Later = false;
        
if(Browser == 3) {
    if(navigator.appVersion.substring(0, navigator.appVersion.indexOf(' ')) >= 9.5) {
        Opera950Later = true;
    }
}

StyleCompatible();

//初始化
if (window.addEventListener) {
    window.addEventListener('load', ImeSetup, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', ImeSetup);
} else {
    window.onload = ImeSetup;
}

//常數設定
var Root = "abcdefghijklmnopqrstuvwxyz,.'[]";
var FullRoot = "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ，．、〔〕";
var SelKey = "012345678";
var SelKey2 = "vrsfwlcbk";
var SelKeyCode = new Array();
var WordsPerPage = 9;

var HalfChar = '`~1!2@3#4$5%6^7&8*9(0)-_=+\\|qQwWeErRtTyYuUiIoOpP[{]}aAsSdDfFgGhHjJkKlL;:\'"zZxXcCvVbBnNmM,<.>/?';
var FullChar = '‘～１！２＠３＃４＄５％６＾７＆８＊９（０）－＿＝＋＼｜ｑＱｗＷｅＥｒＲｔＴｙＹｕＵｉＩｏＯｐＰ〔｛〕｝ａＡｓＳｄＤｆＦｇＧｈＨｊＪｋＫｌＬ；：’”ｚＺｘＸｃＣｖＶｂＢｎＮｍＭ，＜．＞／？';

var ShiftMask = 1
var CtrlMask = 2;
var AltMask = 4;

//全域變數
var CancelKey = false, CancelPress = 0;

var Code = new Array();
var CodeString = "";
var CodeLen = 0;

var WordList = new Array();
var WordData = new Array();
var WordCnt = 0;

var PageCnt;
var NowPage;

var KeyMask = 0;

var IsErrCode = false;
var IsHintCode = false;
var IsLookUp = false;
var IsPhonetic = false;

var IsChMode = true;
var IsHalfMode = true;

var ShiftInterval = 0;
var PureShift = 0;

//物件
var Comp, Cand, txt, HintPic, BtnMode, BtnArrow; //, BtnChMode, BtnHFMode;

//******************系統事件******************
function ImeSetup() {
    //取得網頁上的物件
    Comp      = document.getElementById("Comp");
    Cand      = document.getElementById("Cand");
    txt       = document.getElementById("txt");
    HintPic   = document.getElementById("HintPic");
    //BtnChMode = document.getElementById("BtnChMode");
    //BtnHFMode = document.getElementById("BtnHFMode");
    
    BtnMode  = new Array( document.getElementById("BtnTMode"),
                          document.getElementById("BtnAMode"),
                          document.getElementById("BtnHalf"),
                          document.getElementById("BtnFull") );
        
    BtnArrow = new Array( document.getElementById("BtnArrow0"),
                          document.getElementById("BtnArrow1a"),
                          document.getElementById("BtnArrow1b"),
                          document.getElementById("BtnArrow2a"),
                          document.getElementById("BtnArrow2b"),
                          document.getElementById("BtnArrow3a"),
                          document.getElementById("BtnArrow3b") );
    
    //初始化變數
    for(var i=0; i< SelKey2.length; i++) {
        SelKeyCode[i] = Root.indexOf(SelKey2.charAt(i)) + 1;
    }
    
    txt.disabled = false;
    document.getElementById("loadingDiv").style.display = 'none';
}

function ImeKeyDown(e) {
    var VKCode = e.which ? e.which : e.keyCode;
    var KeyMask2 = (e.shiftKey ? ShiftMask : 0) | (e.ctrlKey ? CtrlMask : 0) | (e.altKey ? AltMask : 0);// | KeyMask;
    
    if(VKCode != 16) PureShift = 0;
    
    if(Browser != 1) {
        if((VKCode >=112 && VKCode <=123) ||
           (VKCode >= 45 && VKCode <= 46) ||
           (VKCode >= 33 && VKCode <= 40) ) {
            CancelKey = true;
        } else {
            CancelKey=false;
        }
    }

    CancelPress = 0;

    switch(VKCode) {
    case 16: //Shift
        if(ShiftInterval == 0) {
            var now = new Date();
            ShiftInterval = now.valueOf();
            PureShift = 1;
        }
        
        KeyMask |= ShiftMask;
        break;
    case 17: //Ctrl
        KeyMask |= CtrlMask;
        break;
    case 18: //Alt
        KeyMask |= AltMask;
        break;
    case 8: //Backspace
        if(! KeyMask2 && IsChMode) {
            if(! DelCode()) {
                CancelPress = VKCode;
                return false;
            }
        }
        break;
    case 27: //Esc
        if(! KeyMask2 && IsChMode) ShowClearCode();
        return false;
    case 32: //Space
        if(! KeyMask2) {
            CancelPress = VKCode;
            
            if(IsChMode) {
                if(! SpaceDown()) return false;
    
                if(! IsHalfMode) {
                    SendWord('　');
                    return false;
                }
            } else if(! IsHalfMode) {
                SendWord('　');
                return false;
            }
            
            CancelPress = 0;
            return true;
        }
        
        if(KeyMask2 == ShiftMask) {
            SwitchHFMode();
            
            CancelPress = VKCode;
            return false;
        }
        
        break;
    case 33: //Page Up
        if(! KeyMask2 && IsChMode && WordCnt > 0) {
            if(PageCnt > 1) JumpPage(NowPage - 1);
            
            CancelPress = VKCode;
            return false;
        }
        
        return true;
    case 34: //Page Down
        if(! KeyMask2 && IsChMode && WordCnt > 0) {
            if(PageCnt > 1) JumpPage(NowPage + 1);
            
            CancelPress = VKCode;
            return false;
        }
        
        return true;
    /*case 112: case 113: case 114: case 115: case 116: case 117: 
    case 118: case 119: case 120: case 121: case 122: case 123: //F1 - F12
        if(! KeyMask2) SwitchChMode();
        break;*/
    case 9: //Tab
        if(! KeyMask2) {
            CopyText();
            
            CancelPress = VKCode;
            return false;
        }
        break;
    }
    
    return true;
}

function ImeKeyPress(e) {
    var VKCode = e.which ? e.which : e.keyCode;
    var KeyMask2 = (e.shiftKey ? ShiftMask : 0) | (e.ctrlKey ? CtrlMask : 0) | (e.altKey ? AltMask : 0);// | KeyMask;
    var tmpCode, i;
    
    if(KeyMask2 & (CtrlMask | AltMask) || e.metaKey) return true;
    if(Browser != 1 && CancelKey) return true;
    if(VKCode == CancelPress) return false;

    if(IsChMode) {
        if( VKCode >= 65 && VKCode <= 90 && ! (KeyMask2 & ShiftMask) ) {
            tmpCode = VKCode + 32;
        } else if( VKCode >= 97 && VKCode <= 122 && (KeyMask2 & ShiftMask) ) {
            tmpCode = VKCode - 32;
        } else {
            tmpCode = VKCode;
        }
        
        for(i = 0; i < Root.length; i++) {
            if(tmpCode == Root.charCodeAt(i)) {
                AddCode(i);
                return false;
            }
        }

        for(i = 0; i < SelKey.length; i++) {
            if(VKCode == SelKey.charCodeAt(i)) {
                if(ChooseWord(i)) return false;
                break;
            }
        }

        switch(VKCode) {
        case 60: // <
            if(WordCnt > 0) {
                if(PageCnt > 1) JumpPage(NowPage - 1);
                return false;
            }
        
            break;
        case 62: // >
            if(WordCnt > 0) {
                if(PageCnt > 1) JumpPage(NowPage + 1);
                return false;
            }
        
            break;
        }
    }
    
    if(! IsHalfMode) {
        for(i = 0; i < HalfChar.length; i++) {
            if(VKCode == HalfChar.charCodeAt(i)) {
                SendWord(FullChar.charAt(i));
                return false;
            }
        }
    }
    
    return true;
}

function ImeKeyUp(e) {
    var VKCode = e.which ? e.which : e.keyCode;

    switch(VKCode) {
    case 16: //Shift
        var now = new Date();
        ShiftInterval = now.valueOf() - ShiftInterval;
        if(PureShift && ShiftInterval < 400) SwitchChMode();
        ShiftInterval = 0;
        
        KeyMask &= (! ShiftMask);
        break;
    case 17: //Ctrl
        KeyMask &= (! CtrlMask);
        break;
    case 18: //Alt
        KeyMask &= (! AltMask);
        break;
    }
    
    return true;
}

function BtnArrowClick(index) {
    switch(index) {
    case 1: JumpPage(NowPage - 1); break;
    case 3: JumpPage(0); break;
    case 5: JumpPage(NowPage + 1); break;
    }
    
    txt.focus();
}

//******************參考檔******************
function GetWord(c) {
    var Index = CodeIndex(c);
    var Head = 0, Tail = TableIndex[Index[0]].length - 1;
    var Ptr, tmp;
    
    WordCnt = 0;
    
    while(Head <= Tail) {
        Ptr = (Head + Tail) >> 1;
        tmp = TableIndex[ Index[0] ][ Ptr ];
        
        if(tmp == Index[1]) {
            for(var i=0; i<TableWord[ Index[0] ][ Ptr ].length; i++) 
                WordList[WordCnt++] = TableWord[ Index[0] ][ Ptr ].charAt(i);
                
            break;
        } else if(tmp < Index[1]) {
            Head = Ptr + 1;
        } else {
            Tail = Ptr - 1;
        }
    }
}

function GetCode(w) {
    var Buf = new Array();
    var Offset, TableLen, i, plc;
    var tmpCode, tmpLen, AnsCode = '', AnsLen = 0, AnsPlc = 100;
    
    for(Buf[0] = 1; Buf[0] <= 28; Buf[0]++) {
        for(Buf[1] = 0; Buf[1] <= 26; Buf[1]++) {
            Offset = Buf[0] << 5 | Buf[1];
            TableLen = TableIndex[Offset].length;

            for(i = 0; i < TableLen; i++) {
                if(TableIndex[Offset][i] == 1024) break;
                
                if((plc = TableWord[Offset][i].indexOf(w)) >= 0) {
                    Buf[2] = TableIndex[Offset][i] >> 5;
                    Buf[3] = TableIndex[Offset][i] & 0x1f;

                    tmpCode = "";
                    for(tmpLen = 0; Buf[tmpLen]; tmpLen++) {
                        tmpCode += FullRoot.charAt(Buf[tmpLen] - 1);
                    }
                    
                    if( (tmpLen > AnsLen) || (tmpLen = AnsLen && plc < AnsPlc) ) {
                        AnsCode = tmpCode;
                        AnsLen = tmpLen;
                        AnsPlc = plc;
                    }
                    
                    if(AnsLen == 4 && AnsPlc == 0) return AnsCode;
                }
            }
        }
    }
    
    return AnsCode;
}

function LookUpCode(c) {
    var Start1 = 1, End1 = 31;
    var Start2 = 0, End2 = 31;
    var Buf = new Array();
    var Offset, TableLen, i, j;
    var Pattern = '', Temp, Tgt;

    WordCnt = 0;

    if(CodeLen > 4) return;
    
    for(i = 0; i < CodeLen; i++) Pattern += GetPattern(c[i]);
    var Reg = new RegExp('^' + Pattern + '$', '');

    if(c[0] < 30) Start1 = End1 = c[0];
    if(c[0] != 30 && c[1] < 30) Start2 = End2 = c[1];

    for(Buf[0] = Start1; Buf[0] <= End1; Buf[0]++) {
        for(Buf[1] = Start2; Buf[1] <= End2; Buf[1]++) {
            Temp = GetPattern(Buf[0]) + GetPattern(Buf[1]);

            Offset = Buf[0] << 5 | Buf[1];
            TableLen = TableIndex[Offset].length;

            for(i = 0; i < TableLen; i++) {
                if(TableIndex[Offset][i] == 1024) break;
                
                Tgt = Temp +
                      GetPattern(Buf[2] = TableIndex[Offset][i] >> 5) +
                      GetPattern(Buf[3] = TableIndex[Offset][i] & 0x1f);

                if(Reg.test(Tgt)) {
                    for(j = 0; j < TableWord[Offset][i].length; j++) {
                        WordList[WordCnt] = TableWord[Offset][i].charAt(j);
                        WordData[WordCnt] = Tgt;
                        WordCnt++;
                    }
                }
            }
        }
    }
}

function GetPattern(c) {
    switch(c) {
    case 30: // [
        return '.+';
    case 31:
        return '.';
    default:
        return FullRoot.charAt(c - 1);
    }
}

//******************IME 輸入******************
function AddCode(c) {
    if(CodeLen < 5) {
        Code[CodeLen] = c + 1;
        CodeString += FullRoot.charAt(c);
        CodeLen++;
    
        ShowCode(CodeString);
        Composition();
    }
}

function DelCode() {
    if(CodeLen > 0) {
        CodeLen--;
        Code[CodeLen] = 0;
        CodeString = CodeString.substring(0, CodeLen);
        
        ShowCode(CodeString);
        Composition();
        
        return false;
    } else if(IsErrCode) {
        ShowCode('');
        
        return false;
    }
    
    return true;
}

function ClearCode() {
    for(var i=0; i<5; i++) { Code[i] = 0; }
    CodeString = '';
    CodeLen = 0;
    
    WordCnt = 0;
}

function ShowClearCode() {
    ClearCode();
    ShowCode('');
    ClearPage();
}

function Composition() {
    IsLookUp = false;

    (CodeLen < 5) ? GetWord(Code) : WordCnt = 0;

    if(WordCnt == 0 && Code[0] == 29) {
        GetWord(new Array(Code[1], Code[2], Code[3], Code[4]));
        IsPhonetic = (WordCnt > 0);
    } else {
        IsPhonetic = false;
    }

    (WordCnt > 1) ? ShowPage() : ClearPage();
}

function SpaceDown() {
    var n=0, tmp;
    
    if(CodeLen > 0) {
        if(IsLookUp) {
            if(PageCnt > 1) JumpPage(NowPage + 1);
            return false;
        }

        if(WordCnt > 0) {
            if(IsPhonetic) {
                if(! GetHomonym(WordList[0])) ErrCode();
            } else {
                SendWord(WordList[0]);
                ShowClearCode();
            }
        } else {
            if(CodeLen > 2) {
                for(var i=0; i<SelKeyCode.length; i++) {
                    if(Code[CodeLen - 1] == SelKeyCode[i]) {
                        n = i + 1;
                        break;
                    }
                }
                
                if(n > 0) {
                    tmp = Code[CodeLen - 1];
                    Code[CodeLen - 1] = 0;
                    GetWord(Code);
                    Code[CodeLen - 1] = tmp;
                    
                    if(! ChooseWord(n) && ! FuncCode()) ErrCode();
                } else {
                    if(! FuncCode()) ErrCode();
                }
            } else {
                if(! FuncCode()) ErrCode();
            }
        }

        return false;
    }
    
    return true;
}

function ChooseWord(n) {
    n += NowPage * WordsPerPage;
    
    if(n < WordCnt) {
        if(IsPhonetic) {
            GetHomonym(WordList[n]);
        } else {
            SendWord(WordList[n]);
        
            if(IsLookUp) {
                HintCode(WordData[n] ? WordData[n] : GetCode(WordList[n]));

                ClearCode();
                ClearPage();
            
                IsLoopUp = false;
            } else {
                ShowClearCode();
            }
        }

        return true;
    }
    
    return false;
}

function FuncCode() {
    var i, chk = false;
    
    for(i = 0; i < CodeLen; i++) {
        if(Code[i] >= 30) {
            chk = true;
            break;
        }
    }
    
    if(chk) {
        LookUpCode(Code);
    
        if(WordCnt > 0) {
            IsLookUp = true;
            ShowPage();
            return true;
        }
    }
    
    return false;
}

function GetHomonym(w) {
    var i, j, tmp, ptr = 0;
    var p = new Array();

    WordCnt = 0;
    
    for(i = 0; i < phonetic.length; i++) {
        if((tmp = phonetic[i].indexOf(w)) >= 0) {
            for(j = ptr - 1; j>=0; j--) {
                if(p[j][1] <= tmp) {
                    break;
                } else {
                    p[j + 1] = p[j];
                }
            }
            
            p[j + 1] = new Array(i, tmp);
            ptr++;
        }
    }

    WordList[WordCnt] = w;
    WordData[WordCnt] = "";

    WordCnt++;
    for(i = 0; i < ptr; i++) {
        for(j = 0; j < phonetic[ p[i][0] ].length; j++) {
            if(phonetic[ p[i][0] ].charAt(j) != w) {
                WordList[WordCnt] = phonetic[ p[i][0] ].charAt(j);
                WordData[WordCnt] = "";
                WordCnt++;
            }
        }
    }
    
    if(WordCnt > 0) {
        ShowPage();
        IsLookUp = true;
    } else {
        ClearPage();
    }

    IsPhonetic = false;
    return true;
}

//******************IME 介面******************
function ShowPage() {
    var tmp = '';
    var top = (WordCnt > WordsPerPage) ? WordsPerPage : WordCnt;
    
    PageCnt = Math.floor((WordCnt - 1) / WordsPerPage) + 1;

    JumpPage(0);
    HintPic.style.display = 'block';
}

// 修改後的寫法
function JumpPage(n) {
    // 將所有 DOM 操作打包，交給瀏覽器去安排執行
    window.requestAnimationFrame(function() {
        var Head, Tail, Len;
        var i, tmp = '';

        NowPage = n;
        if(NowPage >= PageCnt) NowPage = 0;
        else if(NowPage < 0) NowPage = PageCnt - 1;

        Head = NowPage * WordsPerPage;
        Tail = Head + WordsPerPage - 1;
        if(Tail >= WordCnt) Tail = WordCnt-1;

        Len = Tail - Head + 1;

        for(i=0; i<Len; i++) {
            if(i != 0) { tmp += ' '; }
            tmp += SelKey.charAt(i) + WordList[Head + i];
        }

        Cand.innerHTML = tmp;

        if(PageCnt > 1) {
            BtnArrow[0].style.display = 'none';

            if(NowPage == 0) {
                BtnArrow[1].style.display = 'none';
                BtnArrow[2].style.display = 'inline';
                BtnArrow[3].style.display = 'none';
                BtnArrow[4].style.display = 'inline';
                BtnArrow[5].style.display = 'inline';
                BtnArrow[6].style.display = 'none';
            } else if(NowPage == PageCnt - 1) {
                BtnArrow[1].style.display = 'inline';
                BtnArrow[2].style.display = 'none';
                BtnArrow[3].style.display = 'inline';
                BtnArrow[4].style.display = 'none';
                BtnArrow[5].style.display = 'none';
                BtnArrow[6].style.display = 'inline';
            } else {
                BtnArrow[1].style.display = 'inline';
                BtnArrow[2].style.display = 'none';
                BtnArrow[3].style.display = 'inline';
                BtnArrow[4].style.display = 'none';
                BtnArrow[5].style.display = 'inline';
                BtnArrow[6].style.display = 'none';
            }
        } else {
            BtnArrow[0].style.display = 'inline';
            for(var i=1; i<=6; i++) BtnArrow[i].style.display = 'none';
        }
    });
}

function ClearPage() {
    NowPage = 0;
    
    Cand.innerHTML = '';
    HintPic.style.display = 'none';

    BtnArrow[0].style.display = 'inline';
    for(var i=1; i<=6; i++) BtnArrow[i].style.display = 'none';
}

// 修改後的寫法
function ShowCode(s) {
    if(IsErrCode || IsHintCode) {
        IsErrCode = IsHintCode = false;
        Comp.style.color = 'black';
        Comp.style.backgroundColor = '';
    }

    // 將更新畫面的任務交給瀏覽器去安排，避免阻塞
    window.requestAnimationFrame(function() {
        Comp.innerHTML = s;
    });
}

function ErrCode() {
    ClearCode();

    IsErrCode = true;
    Comp.style.color = 'red';
    Comp.style.backgroundColor = 'rgb(128, 128, 128)';
}

function HintCode(s) {
    ClearCode();
    
    IsHintCode = true;
    Comp.style.color = 'rgb(0, 128, 0)';
    
    Comp.innerHTML = s;
}

function SendWord(s) {
    if(typeof document.selection != 'undefined') {
        var r = document.selection.createRange();
        r.text = s;
        
        if(! Opera950Later) r.select();
    } else if(typeof txt.selectionStart != 'undefined') {
        var start = txt.selectionStart, end = txt.selectionEnd;
        var pos = start + s.length;

        txt.value = txt.value.substr(0, start) + s + txt.value.substr(end);
        txt.selectionStart = pos;
        txt.selectionEnd = pos;
    } else {
        txt.value += s;
    }
}

//******************IME 切換******************
function SwitchChMode() {
    IsChMode = ! IsChMode;
    
    //BtnChMode.value = IsChMode ? '無' : 'Ａ';
    
    if(IsChMode) {
        BtnMode[0].style.display = 'inline';
        BtnMode[1].style.display = 'none';
    } else {
        BtnMode[0].style.display = 'none';
        BtnMode[1].style.display = 'inline';
        
        ShowClearCode();
    }
    
    txt.focus();
}

function SwitchHFMode() {
    IsHalfMode = ! IsHalfMode;
    
    //BtnHFMode.value = IsHalfMode ? '半' : '全';

    if(IsHalfMode) {
        BtnMode[2].style.display = 'inline';
        BtnMode[3].style.display = 'none';
    } else {
        BtnMode[2].style.display = 'none';
        BtnMode[3].style.display = 'inline';
    }
    
    txt.focus();
}

//******************副程式******************
function CopyText() {
    if(Browser == 1) { //IE
        txt.select();

        var	r = txt.createTextRange();
        if(r.text.length == 0) return;

        r.execCommand("Copy");
        r.select();
    } else if(window.clipboardData) {
        if(txt.value.length == 0) return;
        window.clipboardData.setData("Text", txt.value);

        txt.select();
    } else if(window.netscape) {
        if(txt.value.length == 0) return;
        
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        var clip  = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        var str   = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        if(! clip || ! trans) return;
        
        str.data = txt.value;
        trans.setTransferData("text/unicode", str, str.data.length * 2);
   		clip.setData(trans, null, Components.interfaces.nsIClipboard.kGlobalClipboard);

        txt.select();
    } else {
        return;
    }
    
    setStatus('已複製文字至剪貼簿');
    setTimeout("setStatus('')", 1000);
}

function setStatus(s) {
    window.status = s;
}

function ConvertCode(s) {
    var i, c = new Array();
    
    for(i=0; i < s.length; i++) { c[i] = Root.indexOf(s.charAt(i)) + 1; }
    for(i=s.length; i<5; i++)   { c[i] = 0; }
    
    return c;
}

function CodeIndex(c) {
    return new Array((c[0] << 5) | c[1], 
                     (c[2] << 5) | c[3]);
}

function StyleCompatible() {
    switch(Browser) {
    case 2: // FireFox
        document.write("<style>ul{margin-left: 0px;} .BtnMode {margin-bottom: -8px;} .BtnArrow {margin-bottom: -3px;}</style>");
        break;
    case 3: // Opera
        document.write("<style>ul{margin-left: 42px;} .BtnMode {margin-bottom: -8px;} .BtnArrow {margin-bottom: -3px;}</style>");
        break;
    }
}

function decodemail2(s) {
    s = s.replace("_AT_", "@");
    return s.replace(/_DOT_/g, ".");
}

function mailto(s) {
    window.location = "mailto:" + decodemail2(s.substr(7));
    return false;
}