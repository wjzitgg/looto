import api from '../../api/require'
import * as types from '../types'
import en from '../../assets/lang/strings_en';
import yd from '../../assets/lang/strings_yd';
import require from '../../api/require';



export default {
    state:{
		en_lang:en, //英文
		yd_lang:yd, //印地语
		webLang:{},//当前语言
		bannerList:[],//首页轮播图列表
		systemInfo:{},//系统信息
		bgColor:'#fff',
		fontColor:'#000',
		borderColor: '#F3F7F9',
		blockBg:'#fff',
		lotteryList:[],//开奖历史
		lotteryClass:[],//彩票种类
		rechargeMobile:'',
		messageList:[],//广播消息数组
		messageData:'',//广播消息
		showAndroid:false,
		showGuide: false,
		sound: true,   //音效
		// mp3http: require('../../assets/mp3/ButtonClick.mp3'),
		// mp3qiu: require('../../assets/mp3/LuckyPick.mp3'),
		guideType:null, //1:那加兰购彩引导  2:比特币汇率购彩引导  3:绑定手机号引导  4:充值引导  5:推广员系统引导  6:代理咨询引导
		guideIndex:0,
		guideList:[
			{
				name:'那加兰购彩引导',
				en:['Welcome to FantasyLand, I am Payal and im going to guide you for this lucky journey! ',
				'Click here to know more rules and payouts details.',
				'Nagaland States Lottery make it possible to win 15core by just Rs.6, Click [Lucky Pick] to generate your ticket',
				'The bet will close 10 seconds before draw the results, Click [Buy now] to complete the purchase',
				'',
				'Done! You just bought a ticket, the history can check from [Ticket]',
				'before the draw, lets check the 3mins draw game for more excitement',
				'From the [Results] page you can see other game and all opening results, Click [Buy now] to buy other games',
				'Click here to know more rules and payouts details.',
				'Stock Lotto does have two source of results, one from the Sensex Stock Market Index and other one is from Bitcoin Prizing, Click here to switch games.',
				'Stock Lotto, including Number Guessing for the last 3 number of the prize and Sum Number Guessing for the total number of the 3, you can try lucky pick for your ticket',
				'The bet will close 10 seconds before draw the results, Click [Buy now] to complete the purchase.',
				'',
				'Done! You just bought a ticket, the history can check from [Ticket]',
				'Stock Lotto is much easier and quicker for just 5 mins per draw! With 50% winning chance at Number guessing and more! ！'],
				hi:['मैं पायल आपका FantasyLand में स्वागत करती हूँ और इस भाग्यशाली यात्रा के लिए आपका मार्गदर्शन करुँगी!',
				'अधिक नियम और भुगतान विवरण जानने के लिए यहां क्लिक करें।',
				'नागालैंड स्टेट्स लॉटरी से सिर्फ 6 रुपये में 15 करोड़ रुपये जीतना संभव है अपने टिकट को उत्पन्न करने के लिए ,[लकी पिक] पर क्लिक करें',
				'दांव परिणाम निकालने से 10 सेकंड पहले बंद हो जाएगी,खरीद को पूरा करने के लिए [अभी खरीदें] पर क्लिक करें',
				'',
				'हो गया!आपने अभी एक टिकट खरीदा है, इतिहास [टिकट] से जांच कर सकते है',
				'ड्रा से पहले, अधिक उत्साह के लिए 3 मीटर ड्रॉ गेम की जांच करने देता है',
				'[परिणाम] पृष्ठ से आप अन्य खेल और सभी शुरुआती परिणाम देख सकते हैं,अन्य खेल खरीदने के लिए [अभी खरीदें] पर क्लिक करें',
				'अधिक नियम और भुगतान विवरण जानने के लिए यहां क्लिक करें।',
				'स्टॉक Lotto में परिणामों के दो स्रोत हैं, एक सेंसेक्स स्टॉक मार्केट इंडेक्स से और दूसरा बिटकॉइन के मूल्य से, गेम स्विच करने के लिए यहां क्लिक करें।',
				'स्टॉक Lotto, जिसमें शामिल है अंतिम 3 नंबर का अनुमान लगाना और तिनो अंको के कुल का सम नंबर अनुमान, आप अपने टिकट के लिए भाग्यशाली चयन की कोशिश कर सकते हैं',
				'स्टॉक Lotto में परिणामों के दो स्रोत हैं, एक सेंसेक्स स्टॉक मार्केट इंडेक्स से और दूसरा बिटकॉइन के मूल्य से, गेम स्विच करने के लिए यहां क्लिक करें।',
				'',
				'हो गया!आपने अभी एक टिकट खरीदा है, इतिहास [टिकट] से जांच कर सकते है',
				'स्टॉक Lotto, जिसमें शामिल है अंतिम 3 नंबर का अनुमान लगाना और तिनो अंको के कुल का सम नंबर...']
			},
			{
				name:'绑定手机号引导',
				en:['Welcome back! Its 3rd days at FantasyLand, Payal noticed you don’t have protections for your account, please link the account with your phone to secure.',
				'Click top left open your profile.',
				'The level of your account security: low,please click for setting.',
				'Confirm your identify here starting with your phone number.',
				'Please make sure you are entering the correct Phone number so you can receive the 4 digit verification code correctly ',
				'OTP send, please enter the correct OTP within 5mins to link your phone, %d bonus will awarded to your account. '],
				hi:['वापसी पर स्वागत है! FantasyLand पर आपका तीसरा  दिन है ,पायल ने देखा कि आपके खाता सुरक्षित नहीं  है,कृपया अपने खाते को सुरक्षित करने के लिए फोन को लिंक करें।',
				'अपने प्रोफ़ाइल को खोलने के लिए ऊपर बाईं ओर क्लिक करें',
				'आपके खाते की सुरक्षा का स्तर:निम्न,कृपया सेटिंग के लिए क्लिक करें',
				'अपने फ़ोन नंबर से शुरू होने वाली अपनी पहचान की पुष्टि करें',
				'कृपया सुनिश्चित करें कि आप सही फ़ोन नंबर दर्ज कर रहे हैं ताकि आप 4 अंकों का सत्यापन कोड सही ढंग से प्राप्त कर सकें',
				'OTP भेजा गया ,कृपया अपना फ़ोन लिंक करने के लिए 5mins के भीतर सही OTP दर्ज करें,आपके खाते में %d बोनस प्रदान किया जाएगा।']
			},
			{
				name:'充值引导',
				en:['',
				'Click to enter deposit',
				'UPI transfer,instant deposit and withdraw',
//				'Bank to Bank transfer',
				'Please try the minimum deposit by UPI transfer, it’s almost instant!',
				'Choice the amount you want to deposit',
				'Please make sure the amount you choice deposit are the same as what you are transferring from your wallet, or your deposit can not be completed.'],
				hi:['',
				'जमा करने के लिए क्लिक करें',
				'UPI स्थानांतरण,तुरंत जमा और निकासी',
//				'बैंक टू बैंक स्थानांतरण',
				'कृपया UPI स्थानांतरण द्वारा न्यूनतम जमा राशि का प्रयास करें, यह लगभग तुरंत है!',
				'वह राशि चुनें जो आप जमा करना चाहते हैं',
				'कृपया सुनिश्चित करें कि आपके द्वारा जमा की गई राशि वही है जो आप अपने वॉलेट से स्थानांतरित कर रहे हैं,या आपकी जमा पूरी नहीं हो सकती है।']
			},
			{
				name:'推广员系统引导',
				en:[
				'Welcome back! We been together for a week already, I believe you do enjoy FantasyLand, Payal hope you can introduce our App to more your friends, and their 10% deposit will becoming your bonus that can be withdraw unconditional!',
				'Click top left open your profile.',
				'Click to enter [Promotion Center]',
				'Click and copy your promotion link and share it with your friends, 10% of their deposit will becoming your bonus.',
				'Or you can use the QR code for your promotion, all user registered by this code will becoming your downline.',
				'Here is where you can check the promotion progress, we wish you can earn everyday.',
				'Hmm.. don’t have any income yet, share your registration link to your friends now! '
				],
				hi:['वापसी पर स्वागत है! हम पहले से ही एक सप्ताह के लिए एक साथ थे,मेरा मानना ',
				'अपने प्रोफ़ाइल को खोलने के लिए ऊपर बाईं ओर क्लिक करें',
				'प्रवेश करने के लिए क्लिक करें [प्रचार केंद्र]',
				'अपने प्रचार लिंक पर क्लिक करें और उसे कॉपी करें और अपने दोस्तों के साथ साझा करें, उनकी जमा राशि का 10% आपका बोनस बन जाएगा।',
				'या आप अपने प्रचार के लिए QR कोड का उपयोग कर सकते हैं, इस कोड द्वारा पंजीकृत सभी उपयोगकर्ता आपका डाउनलाइन बन जाएगा।',
				'यहां आप प्रचार की प्रगति की जांच कर सकते हैं,हम चाहते हैं कि आप रोज़ कमा सकें',
				'हम्म ..अभी तक कोई आय नहीं हुई है,अब अपने दोस्तों से पंजीकरण लिंक साझा करें!'
				]
			},
			{
				name:'代理咨询引导',
				en:[
				'We been together already for half of months, as our loyal friend you should know that you can also be our Agent, please message me at WhatsApp for details.',
				'Click top left open your profile.',
				'Start a chat at WhatsApp with me.',
				'Send message “I want to be Agent” to me thro WhatsApp, will wait you there .'
				],
				hi:['हम आधे महीने से साथ है, हमारे वफादार दोस्त के रूप में आपको पता होना चाहिए कि आप हमारे एजेंट भी हो सकते हैं, अधिक विवरण के लिया कृपया मुझे व्हाट्सएप पर संदेश भेजें।',
				'अपने प्रोफ़ाइल को खोलने के लिए ऊपर बाईं ओर क्लिक करें',
				'मेरे साथ व्हाट्सएप पर चैट शुरू करें।',
				'मेरे  व्हाट्सएप पे संदेश भेजें "मैं एजेंट बनना चाहता हूं", वहां आपका इंतजार करुँगी'
				]
			},
			
		],
		langType:'',
		guideText:[],
		guideI:0,
		guideTemp:'',
		guideTimer:null,
		languageList:[{name:'English',type:'en'},{name:'हिंदी',type:'hi'}],
		langIndex:0,//语言下标
		scrollTime:30,//指引文字滚动间隔
		registerBanner:'',
		showRegisterBanner:false,
		guideBol:true,
		guidePoints:0
		
    },
    mutations:{
        [types.UPDATE_LANG](state,payload){
//      	console.log(payload)
			state.langType = payload
     		if(payload=='en') {
     			state.webLang = state.en_lang
     			localStorage.setItem('lang',state.languageList[0].type)
     			console.log(state.webLang)
     		}else if(payload=='hi') {
     			state.webLang = state.yd_lang
     			localStorage.setItem('lang',state.languageList[1].type)
     			console.log(state.webLang)
     		}
       },

       [types.UPDATE_BGCOLOR](state,payload){
   
        	state.bgColor = payload
       },
       [types.UPDATE_FONTCOLOR](state,payload){
   
        	state.fontColor = payload
       },
       [types.UPDATE_BORDERCOLOR](state,payload){
   
        	state.borderColor = payload
       },
       [types.UPDATE_BLOCKBG](state,payload){
   console.log(payload)
        	state.blockBg = payload
        }
    },
    actions:{
    	//键盘文字效果
  		[types.KEYBOARD_TEXT]({dispatch,state}){

    		if (state.guideI <= state.guideText[state.guideIndex].length || !state.guideText[state.guideIndex]) {
	            state.guideTemp = state.guideText[state.guideIndex].slice(0, state.guideI++) +(state.guideI == state.guideText[state.guideIndex].length+1?'':'_');
	       
	            state.guideTimer = setTimeout(() => {
	               dispatch(types.KEYBOARD_TEXT)
	            }, state.scrollTime);
	        } else {
	            clearTimeout(state.guideTimer)
	        }
  		},
  		[types.STOP_KEYBOARD_TEXT]({dispatch,state}){
  			state.guideTemp = state.guideText[state.guideIndex]
  			clearTimeout(state.guideTimer)
  		}
    }
}
