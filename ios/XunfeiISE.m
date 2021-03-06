//
//  XunfeiISE.m
//  LiuliSpeak
//
//  Created by guojicheng on 16/6/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "XunfeiISE.h"

#import "RCTConvert.h"
#import "XFiseBridge.h"
#import "ISEResultXmlParser.h"
#import "ISEResult.h"
#import "PcmPlayer.h"
#import "PcmPlayerDelegate.h"

@interface XunfeiISE() <ISEResultXmlParserDelegate, PcmPlayerDelegate>

@property (nonatomic, strong) NSString* resultXml;
@property (nonatomic, strong) NSString* resultText;
@property (nonatomic, retain) PcmPlayer* pcmPlayer;
@property (nonatomic, retain) NSDictionary* dicInfos;

@end

@implementation XunfeiISE

-(instancetype)init {
  self = [super init];
  
  return self;
}

-(void)initISE:(NSDictionary*) infos
{
  [IFlySetting showLogcat:NO];
  
  NSString *initString = [[NSString alloc] initWithFormat:@"appid=%@", [RCTConvert NSString:infos[@"APPID"]]];
  //所有服务启动前，需要确保执行createUtility
  [IFlySpeechUtility createUtility:initString];
  
  //创建评测对象
  _evaluatorIns = [IFlySpeechEvaluator sharedInstance];
  _evaluatorIns.delegate = self;
  
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  _pcmFilePath = [paths objectAtIndex:0];
  //  NSLog(@"%@", _pcmFilePath);
}

-(void)setEvaluator:(NSDictionary *)infos
{
  _dicInfos = infos;
  //设置训练参数
  //清空参数
  [_evaluatorIns setParameter:@"" forKey:[IFlySpeechConstant PARAMS]];
  
  //设置评测采样率
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"SAMPLE_RATE"]] forKey:[IFlySpeechConstant SAMPLE_RATE]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant SAMPLE_RATE]]);
  //设置评测题目编码，如果是utf-8格式，请添加bom头，添加方式可参考demo
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"TEXT_ENCODING"]] forKey:[IFlySpeechConstant TEXT_ENCODING]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant TEXT_ENCODING]]);
  //设置评测题目结果格式，目前仅支持xml
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"ISE_RESULT_TYPE"]] forKey:[IFlySpeechConstant ISE_RESULT_TYPE]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant ISE_RESULT_TYPE]]);
  //设置评测前端点超时，默认5000ms
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"VAD_BOS"]] forKey:[IFlySpeechConstant VAD_BOS]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant VAD_BOS]]);
  //设置评测后端点超时，默认1800ms
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"VAD_EOS"]] forKey:[IFlySpeechConstant VAD_EOS]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant VAD_EOS]]);
  //设置评测前端点 评测题型，可选值：read_syllable（单字，汉语专有）、read_word（词语）、read_sentence（句子）
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"ISE_CATEGORY"]] forKey:[IFlySpeechConstant ISE_CATEGORY]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant ISE_CATEGORY]]);
  //设置评测语言，可选值：en_us（英语）、zh_cn（汉语）
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"LANGUAGE"]] forKey:[IFlySpeechConstant LANGUAGE]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant LANGUAGE]]);
  //设置评测结果级别，可选值：plain（仅英文）、complete，默认为complete
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"ISE_RESULT_LEVEL"]] forKey:[IFlySpeechConstant ISE_RESULT_LEVEL]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant ISE_RESULT_LEVEL]]);
  //设置评测超时，录音超时，录音达到时限时自动触发vad，停止录音，默认-1（无超时）
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"SPEECH_TIMEOUT"]] forKey:[IFlySpeechConstant SPEECH_TIMEOUT]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant SPEECH_TIMEOUT]]);

  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"ISE_AUDIO_PATH"]] forKey:[IFlySpeechConstant ISE_AUDIO_PATH]];
  NSLog(@"%@", [_evaluatorIns parameterForKey:[IFlySpeechConstant ISE_AUDIO_PATH]]);
  
//  [_evaluatorIns setParameter:@"utf-8" forKey:[IFlySpeechConstant RESULT_ENCODING]];
}

-(void)startEvaluator:(NSDictionary *)infos iseBridge:(XFiseBridge*)iseBridge
{
  _xunfeiReact = iseBridge;
  //设置评测参数
  [self setEvaluator:infos];
  
  
  NSMutableData* buffer = nil;
  //中文utf8 需要添加bom头才可以
  Byte bomHeader[] = {0xEF, 0xBB, 0xBF};
  buffer = [NSMutableData dataWithBytes:bomHeader length:sizeof(bomHeader)];
  [buffer appendData:[[RCTConvert NSString:infos[@"TEXT"]] dataUsingEncoding:NSUTF8StringEncoding]];
  NSLog(@"%@", [RCTConvert NSString:infos[@"TEXT"]]);
  //  [buffer appendData:[@"你好" dataUsingEncoding:NSUTF8StringEncoding]];
  
  //开始录音评测
  [_evaluatorIns startListening:buffer params:nil];
  
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_START];
}

-(void)stopEvaluator
{
  [_evaluatorIns stopListening];
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_STOP];
}

-(void)cancelEvaluator
{
  [_evaluatorIns cancel];
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_STOP];
}

-(BOOL)initPcm:(NSString*) filePath rate:(long)rate
{
  if(_pcmPlayer != nil){
    _pcmPlayer = nil;
  }
  NSString* tmpPath = filePath;
  if (tmpPath == nil) {
    tmpPath = [[NSString alloc] initWithFormat:@"%@",
               [_pcmFilePath stringByAppendingPathComponent:[RCTConvert NSString:_dicInfos[@"ISE_AUDIO_PATH"]]]];
  }else{
    tmpPath = [[NSString alloc] initWithFormat:@"%@",
               [_pcmFilePath stringByAppendingPathComponent:filePath]];
  }
  
  _pcmPlayer = [[PcmPlayer alloc] initWithFilePath:tmpPath sampleRate:rate];
  if (_pcmPlayer == nil){
    return NO;
  }
  _pcmPlayer.delegate = self;
  return YES;
}

-(void)playPcm
{
  [_pcmPlayer play];
}

-(void)stopPcm
{
  if (_pcmPlayer){
    [_pcmPlayer stop];
  }
  //_pcmPlayer = nil;
}

-(void)pausePcm
{
  [_pcmPlayer pause];
}

-(double)getPcmLong
{
  return [_pcmPlayer getLong];
}

-(double)getPcmCurrentTime
{
  return [_pcmPlayer getCurrentTime];
}


#pragma mark - IFlySpeechEvaluatorDelegate

- (void)onVolumeChanged:(int)volume buffer:(NSData *)buffer
{
  //  NSLog(@"volume：%d", volume);
  [_xunfeiReact iseVolume:[NSString stringWithFormat:@"%d",volume]];
}


- (void)onBeginOfSpeech
{
  NSLog(@"start record");
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_WORK];
}


- (void)onEndOfSpeech
{
  NSLog(@"stop record");
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_RECOG];
}


- (void)onCancel
{
  NSLog(@"on cancel");
}


- (void)onError:(IFlySpeechError *)errorCode
{
  if (errorCode && errorCode.errorCode != 0){
    NSLog(@"error:%d %@", errorCode.errorCode,errorCode.errorDesc);
    
    [_xunfeiReact iseCallback:CB_CODE_ERROR
                       result:[NSString stringWithFormat:@"%d_%@",errorCode.errorCode,errorCode.errorDesc]];
  }
}


- (void)onResults:(NSData *)results isLast:(BOOL)isLast{
  if (results){
    NSString *showText = @"";
    
    const char* chResult= [results bytes];
    
    BOOL isUTF8=[[_evaluatorIns parameterForKey:[IFlySpeechConstant RESULT_ENCODING]]isEqualToString:@"utf-8"];
    NSString* strResults=nil;
    if(isUTF8){
      strResults=[[NSString alloc] initWithBytes:chResult length:[results length] encoding:NSUTF8StringEncoding];
    }else{
      NSLog(@"result encoding: gb2312");
      NSStringEncoding encoding = CFStringConvertEncodingToNSStringEncoding(kCFStringEncodingGB_18030_2000);
      strResults = [[NSString alloc] initWithBytes:chResult length:[results length] encoding:encoding];
    }
    if(strResults){
      showText = [showText stringByAppendingString:strResults];
    }
    
    self.resultXml = showText;
    //      NSLog(@"%@",showText);
    ISEResultXmlParser* parser = [[ISEResultXmlParser alloc] init];
    parser.delegate = self;
    [parser parserXml:self.resultXml];
    if (isLast){
      
    }
  }else{
    if (isLast){
      NSLog(@"你好像没有说话哦");
    }
  }
}


#pragma mark - ISEResultXmlParserDelegate
-(void)onISEResultXmlParser:(NSXMLParser *)parser Error:(NSError*)error{
  
}

-(void)onISEResultXmlParserResult:(ISEResult*)result{
  _resultText = [result toString];
  [_xunfeiReact iseCallback:CB_CODE_RESULT result:_resultText];
}


#pragma mark - PcmPlayerDelegate
//播放音频结束
-(void)onPlayCompleted {
  [_xunfeiReact playCallback:PCM_PLAYOVER msg:@"0"];
}

@end
