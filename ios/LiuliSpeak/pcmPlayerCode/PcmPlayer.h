//
//  pcmPlayer.h
//  MSCDemo
//
//  Created by wangdan on 14-11-4.
//
//

#import <Foundation/Foundation.h>
#import<AVFoundation/AVFoundation.h>

#import "PcmPlayerDelegate.h"

@interface PcmPlayer : NSObject<AVAudioPlayerDelegate>

/**
 * 初始化播放器，并传入音频的本地路径
 *
 * path   音频pcm文件完整路径
 * sample 音频pcm文件采样率，支持8000和16000两种
 ****/
-(id)initWithFilePath:(NSString *)path sampleRate:(long)sample;


/**
 * 初始化播放器，并传入音频数据
 *
 * data   音频数据
 * sample 音频pcm文件采样率，支持8000和16000两种
 ****/
-(id)initWithData:(NSData *)data sampleRate:(long)sample;


/**
 开始播放
 ****/
- (void)play;



/**
 停止播放
 ****/
- (void)stop;


/**
 得到声音的详细信息
 ****/
- (double)getLong;

/**
 从特定位置开始播放
 ****/
- (void)playAt:(double)start endAt:(double)end;

/**
 是否在播放状态
 ****/
@property (nonatomic,assign) BOOL isPlaying;

@property (nonatomic, assign) id <PcmPlayerDelegate> delegate;

@end
