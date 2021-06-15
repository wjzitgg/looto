import url from 'url'
import config from './config'
let basePath=config.basePath

export default {

    //程序信息
    getAppVer:url.resolve(basePath,'loginAction_doSysReleaseNO.do'), //版本号
    getSysTime:url.resolve(basePath,'loginAction_doGetSysTime.do'),//服务器时间

	//登陆服务
    doLogin:url.resolve(basePath,'loginAction_doLoginAuthorization.do'), //登陆授权
    getNewToken:url.resolve(basePath,'loginAction_doRefurbishAuthorization.do'),//刷新Token
    getLoginStatus:url.resolve(basePath,"loginAction_doLoginStatus.do"),//获取登录状态
    getUserInfo:url.resolve(basePath,"loginAction_doLoginInfo.do"),//获取用户信息

    //注册服务
    doRegister:url.resolve(basePath,'taUser_registered.do'),//注册
    sendMsg:url.resolve(basePath,'taUser_sendMsg.do'),//发送短信验证码
    forgetPwded:url.resolve(basePath,'taUser_forgetPwded.do'),//忘记密码
    forgetPayPwded:url.resolve(basePath,'taUser_forgetTradePwded.do'),//忘记支付密码
    resetPwded:url.resolve(basePath,'taUser_resetPwded.do'),//修改密码
    resetPayPwded:url.resolve(basePath,'taUser_resetTradePwded.do'),//修改支付密码
    doCheckCustomerCode:url.resolve(basePath,'customer_doCheckCustomerCode.do'), //验证邀请码
    doLoginOut:url.resolve(basePath,'loginAction_doLoginOut.do'), //退出登录
    
    
    //商城
    doQueryMallProduct:url.resolve(basePath,'tmmallproduct_doQueryMallProduct.do'), //商城商品列表
    doQueryProductCatalog:url.resolve(basePath,'productCatalog_doQueryProductCatalog.do'), //商城分类列表查询
    doMallProductInfo:url.resolve(basePath,'tmmallproduct_doMallProductInfo.do'), //商城商品详情
    doQueryNewsList:url.resolve(basePath,'news_doQueryNewsList.do'), //广告轮播列表查询
    doQuerySeriesProduct:url.resolve(basePath,'tmmallproduct_doQuerySeriesProduct.do'), //按照系列查询商品列表
    doQueryCatalogProduct:url.resolve(basePath,'tmmallproduct_doQueryCatalogProduct.do'), //按分类查询商品列表
    doQueryProductSpec:url.resolve(basePath,'tmmallproduct_doQueryProductSpec.do'), //查询商品规格
    doQueryScanRecord:url.resolve(basePath,'tmmallproduct_doQueryScanRecord.do'), //商品浏览记录查询
    doAddProductAdvice:url.resolve(basePath,'tmmallproduct_doAddProductAdvice.do'), //新增商品咨询
    doQueryAdviceRecord:url.resolve(basePath,'tmmallproduct_doQueryAdviceRecord.do'), //查询商品咨询
    doAddFeedback:url.resolve(basePath,'tmmallproduct_doAddFeedback.do'), //新增商品评价
    doQueryFeedback:url.resolve(basePath,'tmmallproduct_doQueryFeedback.do'), //查询商品评价列表
    doQueryWaitForFeedback:url.resolve(basePath,'tmmallproduct_doQueryWaitForFeedback.do'), //查询待评价商品
    doQueryAllFeedbackByProductId:url.resolve(basePath,'tmmallproduct_doQueryAllFeedbackByProductId.do'), //查询商品全部评价
    doDelFeedback:url.resolve(basePath,'tmmallproduct_doDelFeedback.do'), //删除商品评价
    doQueryMallOrderList:url.resolve(basePath,'tmproductorder_doQueryMallOrderList.do'), //商城订单列表查询
    doQueryMallOrder:url.resolve(basePath,'tmproductorder_doQueryMallOrder.do'), //商城订单查询
    doQueryProductParam:url.resolve(basePath,'tmmallproduct_doQueryProductParam.do'), //商城商品参数列表
    doQueryShoppingCart:url.resolve(basePath,'tmshoppingcart_doQueryShoppingCart.do'), //购物车查询
    doAddCart:url.resolve(basePath,'tmshoppingcart_doAddCart.do'), //添加购物车   
    doDelCart:url.resolve(basePath,'tmshoppingcart_doDelCart.do'), //删除购物车
    doEditCart:url.resolve(basePath,'tmshoppingcart_doEditCart.do'), //修改购物车
    doQueryInvoice:url.resolve(basePath,'taUserInvoice_doQueryInvoice.do'), //查询发票列表
    doInvoiceDetail:url.resolve(basePath,'taUserInvoice_doInvoiceDetail.do'), //查询发票信息
    doCreateInvoice:url.resolve(basePath,'taUserInvoice_doCreateInvoice.do'), //新增发票信息
    doEditInvoice:url.resolve(basePath,'taUserInvoice_doEditInvoice.do'), //编辑发票信息
    doDelInvoice:url.resolve(basePath,'taUserInvoice_doDelInvoice.do'), //删除发票信息
    doQueryVoucher:url.resolve(basePath,'voucher_doQueryVoucher.do'), //查询优惠券信息
    doProductOrder:url.resolve(basePath,'tmproductorder_doProductOrder.do'), //商品下单
    doCancelOrder:url.resolve(basePath,'tmproductorder_doCancelOrder.do'), //取消订单
    doConfirmRecv:url.resolve(basePath,'tmproductorder_doConfirmRecv.do'), //确认收货
    doSystemAmountPay:url.resolve(basePath,'payOrder_doSystemAmountPay.do'), //系统余额支付
    doQueryFavorites:url.resolve(basePath,'tmFavorites_doQueryFavorites.do'), //查询商品收藏列表
    doAddFavorites:url.resolve(basePath,'tmFavorites_doAddFavorites.do'), //新增商品收藏
    doDelFavorites:url.resolve(basePath,'tmFavorites_doDelFavorites.do'), //删除商品收藏
    clearAllFavorites:url.resolve(basePath,'tmFavorites_doClearFavorites.do'),//清空商品收藏
    doQueryRtnGoodsList:url.resolve(basePath,'tmproductorder_doQueryRtnGoodsList.do'),//退货列表查询
    doQueryRefundList:url.resolve(basePath,'tmproductorder_doQueryRefundList.do'),//退款列表查询
    doBBIOpenPosition:url.resolve(basePath,'trade_doBBIOpenPosition.do'),//预付款下单
    doOrderDetail:url.resolve(basePath,'orderHold_doOrderDetail.do'),//预付款单详情
    doOrderHisDetail:url.resolve(basePath,'orderHoldHis_doOrderHisDetail.do'),//平仓单查询
    doOrderHold:url.resolve(basePath,'orderHold_doOrderHold.do'),//预付款单列表查询
    doOrderHoldHis:url.resolve(basePath,'orderHoldHis_doOrderHoldHis.do'),//平仓单列表查询
    doBBIClosePosition:url.resolve(basePath,'trade_doBBIClosePosition.do'),//退订
    doBuyBackChangeDeliverTheGoods:url.resolve(basePath,'trade_doBuyBackChangeDeliverTheGoods.do'),//预付款回购转交货
    doPickUpPriceDifference:url.resolve(basePath,'tmproductorder_doPickUpPriceDifference.do'),//预付款预定转提货
    doQueryProductSpec:url.resolve(basePath,'product_doQueryProductSpec.do'),//查询交易规格信息
    
    getPayInfo:url.resolve(basePath,'hftxQuickWebPay_getPayInfo.do'),//支付

    doQueryProduct:url.resolve(basePath,'product_doQueryProduct.do'),//交易商品查询
    doQueryRecommendProduct:url.resolve(basePath,'tmmallproduct_doQueryRecommendProduct.do'),//推荐商品列表（猜你喜欢）

    //收货地址
    addAddress:url.resolve(basePath,'customerAddr_doCreateAddress.do'),//新增收货地址
    queryAddress:url.resolve(basePath,'customerAddr_doAddress.do'),//查询收获地址
    updateAddress:url.resolve(basePath,'customerAddr_doUpdateAddress.do'),//修改收货地址
    delAddress:url.resolve(basePath,'customerAddr_doDelAddress.do'),//删除收货地址
    doAddressDetail:url.resolve(basePath,'customerAddr_doAddressDetail.do'),//地址详情

    //个人资料
    queryCustomInfo:url.resolve(basePath,'customer_doGetCustomerInfo.do'),//查询个人资料
    updateCustomInfo:url.resolve(basePath,'customer_doUpdateCustomerInfo.do'),//编辑个人资料
    doCertification:url.resolve(basePath,'customer_doCertification.do'),//实名认证
    queryAccountBalance:url.resolve(basePath,'cusAccountBook_doAccountBalance.do'),//账户余额查询
    queryAccountLevel:url.resolve(basePath,'customer_doGetCustomerLevel.do'),//查询客户等级
    queryHintInfo:url.resolve(basePath,'tmmallproduct_doQueryHintInfo.do'),//查询个人中心提示信息查询
    doSetCusIcon:url.resolve(basePath,'customer_doSetCusIcon.do'),//头像
    doSetCusParam:url.resolve(basePath,'customer_doSetCusParam.do'),//参数设置
    doGetAgentInfo:url.resolve(basePath,'customer_doGetAgentInfo.do'),//查询经纪人
    doAddInviteCode:url.resolve(basePath,'customer_doAddInviteCode.do'),//发送推荐码
    doApplicationAgent:url.resolve(basePath,'customer_doApplicationAgent.do'),//申请成为经纪人
    doQueryCusParam:url.resolve(basePath,'customer_doQueryCusParam.do'),//查询客户参数信息
    doUpdateBankInfo:url.resolve(basePath,'customer_doUpdateBankInfo.do'),//更换银行卡
    doQueryCustomerLevelProperty:url.resolve(basePath,'customerLevel_doQueryCustomerLevelProperty.do'),//查询客户等级属性
    doUpgradeLevel:url.resolve(basePath,'customer_doUpgradeLevel.do'),//升级客户等级
    doQueryBackOrderList:url.resolve(basePath,'tmBackOrder_doQueryBackOrderList.do'),//查询我的回购列表
    doCreditsExchange:url.resolve(basePath,'tmproductorder_doCreditsExchange.do'),//积分兑换商品
    doMyReferrals:url.resolve(basePath,'customer_doMyReferrals.do'),//查询我的推荐
    doRecommendationFee:url.resolve(basePath,'customer_doRecommendationFee.do'),//查询我的推荐费
    doBUCoinExchange:url.resolve(basePath,'tmproductorder_doBUCoinExchange.do'),//bu兑换商品
    doBUAmount:url.resolve(basePath,'takeFeeApply_doBUAmount.do'),//Bu币余额查询
    doQueryAssertHistory:url.resolve(basePath,'cusAccountBook_doBUBookChange.do'),//BU币变动记录查询
    doCustBalanceExchange:url.resolve(basePath,'cusAccountBook_doCustBalanceExchange.do'),//钻石换积分
    doQueryChangeHistory:url.resolve(basePath,'cusAccountBook_doBookChange.do'),//资金变动记录
    
    doRecharge:url.resolve(basePath,'hftxQuickWebPay_doRecharge.do'),//支付
    doChargeRecordList:url.resolve(basePath,'chargeRecords_chargeRecordList.do'),//充值记录查询
    doWithdraw:url.resolve(basePath,'takeFeeApply_doApplyGold.do'),//提现
    doBookChange:url.resolve(basePath,'takeFeeApply_doTakeFeeApplys.do'),//查询提现申请列表
    doWxPay:url.resolve(basePath,'wxAction_doPrePay.do'),//微信支付
    doWxPayFail:url.resolve(basePath,'wxAction_doFailPay.do'),//微信支付失败
    getJsApi:url.resolve(basePath,'wxAction_doGetJsApi.do'),//微信api

    //我的消息收件箱
    queryInbox:url.resolve(basePath,'noticePersons_doQueryNoticePersons.do'),//查询个人收件箱列表
    queryInboxDetail:url.resolve(basePath,'noticePersons_doQueryNoticePersonsDetail.do'),//查询个人收件箱详情
    updateInboxStatus:url.resolve(basePath,'noticePersons_doUpdateNoticePersonsFlag.do'),//更新收件箱阅读状态
    queryInboxCount:url.resolve(basePath,'noticePersons_doQueryNoReadCount.do'),//查询收件箱数量
    
    doBlogArticles:url.resolve(basePath,'blogArticle_doBlogArticles.do'),//资讯列表
    getArticleInfo:url.resolve(basePath,'blogArticle_doBlogArticleInfo.do'),//资讯详情
    
    doQueryGames:url.resolve(basePath,'platformgames_doQueryGames.do'),//查询游戏列表
    doGoTOGame:url.resolve(basePath,'platformgames_doGoToGame.do'),//获取游戏跳转链接

    //字典
    queryDictList:url.resolve(basePath,'sysdict_queryDictList.do'),
     //查询系统参数
    querySystemParam:url.resolve(basePath,'sysConfig_querySysConfigByCode.do')
}
