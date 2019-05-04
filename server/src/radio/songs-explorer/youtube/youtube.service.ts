import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from 'core/config/config.service';
import { EnvVariables } from 'core/config/config.variables';
import * as getVideoId from 'get-video-id';
import * as Moment from 'moment';
import fetch from 'node-fetch';
import { VideoReturnType, YoutubeVideo } from './interfaces';

@Injectable()
export class YoutubeService {
  constructor(private readonly configService: ConfigService) {}

  public parseVideoUrl(url: string): VideoReturnType {
    const { id, service } = getVideoId(url);
    if (!id) throw new InternalServerErrorException('Invalid url');
    if (service !== 'youtube') throw new NotAcceptableException(`Service ${service} is not supported yet`);
    return { id, service };
  }

  public async fetchVideoDetail(videoId: string): Promise<YoutubeVideo.Video> {
    const apiUrl = this.configService.get(EnvVariables.YOUTUBE_API_URL);
    const apiKey = this.configService.get(EnvVariables.YOUTUBE_API_KEY);
    const part = 'id,snippet,contentDetails';
    const serviceUrl = `${apiUrl}/videos?id=${videoId}&key=${apiKey}&part=${part}`;
    const data = await fetch(serviceUrl).then(res => res.json());
    if (data && data.items && data.items[0]) {
      const video = data.items[0];
      video.contentDetails.duration = this.parseDuration(video.contentDetails.duration);
      return video;
    }
    throw new InternalServerErrorException(`Could not find video with this request URL: ${serviceUrl}`);
  }

  public async searchVideos({
    q,
    maxResults = 5,
    order = 'relevance',
  }: {
    q: string;
    maxResults?: number;
    order?: YoutubeVideo.Order;
  }): Promise<YoutubeVideo.Video[]> {
    const apiUrl = this.configService.get(EnvVariables.YOUTUBE_API_URL);
    const apiKey = this.configService.get(EnvVariables.YOUTUBE_API_KEY);
    const part = 'id,snippet';
    const type = 'video';
    const serviceUrl = `${apiUrl}/search?key=${apiKey}&type=${type}&part=${part}&q=${q}&maxResults=${maxResults}&order=${order}`;
    const data = await fetch(serviceUrl).then(res => res.json());
    if (data && Array.isArray(data.items)) {
      return data.items.map(item => ({
        ...item,
        id: item.id && item.id.videoId,
      }));
    }
    throw new InternalServerErrorException(`Could not find any videos with this request URL: ${serviceUrl}`);
  }

  public parseDuration(duration: string) {
    return Moment.duration(duration).asMilliseconds();
  }
}
