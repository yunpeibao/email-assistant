'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Send, Copy, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon } from 'lucide-react'; 

// 定义类型接口
interface CollaborationType {
  duration?: string;
  unit?: string;
}

interface CollaborationValue {
  checked: boolean;
  duration?: string;
}

interface DateRange {
  start: string;
  end: string;
  draft: string;
}

interface FormData {
  platforms: string[];
  projectDescription: string;
  playStoreLink: string;
  recipient: string;
  senderName: string;
  collaborationTypes: Record<string, CollaborationValue>;
  dateRange: DateRange;
  influencerName: string;
  userName: string;
  expectedPrice: string;
  deadline: string;
}

// 合作形式选项
const getCollaborationOptions = (platforms: string[]) => {
  const options: Record<string, { duration: boolean; unit?: string }> = {
    'UGC': { duration: true, unit: '月' },
    'biolink': { duration: true, unit: '天' },
    'social media post': { duration: false }
  };

  platforms.forEach(platform => {
    switch(platform) {
      case 'YouTube':
        options['YT integrated video'] = { duration: true, unit: '分钟' };
        options['YT dedicated video'] = { duration: true, unit: '分钟' };
        options['YouTube shorts'] = { duration: false };
        options['YouTube live'] = { duration: true, unit: '小时' };
        break;
      case 'TikTok':
        options['TT video'] = { duration: true, unit: '秒' };
        options['ads code'] = { duration: true, unit: '天' };
        break;
      case 'Twitch':
        options['Twitch livestream'] = { duration: true, unit: '小时' };
        break;
      case 'Instagram':
        options['IG reels'] = { duration: false };
        break;
    }
  });

  return options;
};

// 邮件模板
const emailTemplates = {
  initial: (data: FormData) => {
    const collaborationText = Object.entries(data.collaborationTypes)
  .filter(([_, value]) => value.checked)
  .map(([type, value]) => {
    if (value.duration) {
      return `${value.duration || '1'}* ${type}`;
    }
    return `1* ${type}`;
  })
  .join(' + ');

    const dateText = data.dateRange.start === data.dateRange.end ? 
      data.dateRange.start : 
      `${data.dateRange.start} - ${data.dateRange.end}`;

    return `Dear ${data.recipient},

How are you? Hope your week is going well. I'm e-mailing you for building a cooperation partnership with you.

Let me introduce myself first, my name is ${data.senderName}. I am working for BlueFocus, the biggest International Marketing and Public company in Asia. Almost all the Asian gaming brands are currently working with us. Such as Mobile Legend: Adventure, UNO! Mobile, State of Survival, King of Avalon, Guns of Glory, etc...

And now I'm inviting you to cooperate with us, promoting a new project on ${data.platforms.join(' and ')}:

${data.projectDescription}

${data.playStoreLink ? `Google Play Store Link: ${data.playStoreLink}\n\n` : ''}For this campaign, please find SOW below
Deliverables: ${collaborationText}
Post Date: ${dateText}${data.dateRange.draft ? `\nDraft Due: ${data.dateRange.draft}` : ''}

The brand is interested in collaborating with you. If you are also interested in this, please tell me your availability and rate for this SOW.

Really hope to get your reply!

Best regards,
${data.senderName}`;
  },
  followup: (data: FormData) => `Dear ${data.influencerName},

I hope you're doing well. I'm following up on my previous email regarding our collaboration opportunity.

Given our campaign timeline (deadline: ${data.deadline}), I wanted to check if you've had a chance to review our proposal.

Looking forward to hearing from you.

Best regards,
${data.userName}`,
  negotiation: (data: FormData) => `Dear ${data.influencerName},

Thank you for sharing your rate card and showing interest in our collaboration opportunity.

After reviewing our campaign budget and project scope, we would like to propose a rate of ${data.expectedPrice} for this collaboration. We believe this offer aligns well with the project requirements while ensuring fair compensation for your valuable work.

We really value the quality of your content and believe you would be a perfect fit for our campaign. We would love to work with you and hope we can find a middle ground that works for both parties.

Would you be open to discussing this adjusted proposal?

Best regards,
${data.userName}`,
  rejection: (data: FormData) => `Dear ${data.influencerName},

Thank you for your interest and for providing your collaboration terms.

After careful consideration of our campaign requirements and current partnerships, we regret to inform you that we won't be able to move forward with the collaboration at this time.

We truly appreciate your time and would love to keep in touch for potential future opportunities.

Best regards,
${data.userName}`
};

const EmailAssistant = () => {
  const [scenario, setScenario] = useState('initial');
  const [showEmail, setShowEmail] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const inputClassName = "mt-1 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100";
  const labelClassName = "text-gray-900 dark:text-gray-100";
  const cardClassName = "w-full max-w-4xl mx-auto bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800";
  const selectClassName = "w-full border rounded p-2 mt-1 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100";
  const checkboxLabelClassName = "flex items-center p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-900 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950";
  
  const [formData, setFormData] = useState<FormData>({
    platforms: [],
    projectDescription: '',
    playStoreLink: '',
    recipient: '',
    senderName: '',
    collaborationTypes: {},
    dateRange: { start: '', end: '', draft: '' },
    influencerName: '',
    userName: '',
    expectedPrice: '',
    deadline: ''
  });

  const platforms = ['YouTube', 'TikTok', 'Instagram', 'Twitch'];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCollaborationChange = (type: string, value: boolean | string, isDuration = false) => {
    setFormData(prev => ({
      ...prev,
      collaborationTypes: {
        ...prev.collaborationTypes,
        [type]: isDuration 
          ? { ...prev.collaborationTypes[type], duration: value as string }
          : { checked: value as boolean }
      }
    }));
  };

  if (showEmail) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>生成的邮件</span>
            <Button variant="outline" onClick={() => setShowEmail(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回编辑
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded p-4 bg-gray-50 dark:bg-gray-900 whitespace-pre-line text-gray-900 dark:text-gray-100">
            {emailContent}
          </div>
          <Button 
            className="w-full"
            onClick={() => navigator.clipboard.writeText(emailContent)}
          >
            <Copy className="w-4 h-4 mr-2" />
            复制到剪贴板
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-6 h-6" />
          邮件助手
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 场景选择 */}
          <div>
            <Label>选择场景</Label>
            <select
  value={scenario}
  onChange={(e) => setScenario(e.target.value)}
  className="w-full border rounded p-2 mt-1 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500"
>
              <option value="initial">首次建联</option>
              <option value="followup">追问回复</option>
              <option value="negotiation">价格谈判</option>
              <option value="rejection">婉拒回复</option>
            </select>
          </div>

          {/* 首次建联场景的表单 */}
          {scenario === 'initial' && (
            <div className="space-y-4">
              {/* 平台选择 */}
              <div className="space-y-2">
                <Label>合作平台（可多选）</Label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map(platform => (
                    <label key={platform} className="flex items-center p-2 border rounded hover:bg-gray-50">
                      <Checkbox
                        checked={formData.platforms.includes(platform)}
                        onCheckedChange={() => {
                          const newPlatforms = formData.platforms.includes(platform)
                            ? formData.platforms.filter(p => p !== platform)
                            : [...formData.platforms, platform];
                          handleChange('platforms', newPlatforms);
                        }}
                      />
                      <span className="ml-2">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 合作形式 */}
              {formData.platforms.length > 0 && (
                <div className="space-y-2">
                  <Label>合作形式</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(getCollaborationOptions(formData.platforms)).map(([type, options]) => (
                      <div key={type} className="space-y-2">
                        <label className="flex items-center">
                          <Checkbox
                            checked={formData.collaborationTypes[type]?.checked || false}
                            onCheckedChange={(checked) => handleCollaborationChange(type, !!checked)}
                          />
                          <span className="ml-2">{type}</span>
                        </label>
                        {options.duration && formData.collaborationTypes[type] && (
                          <Input
                            type="text"
                            placeholder={`输入${options.unit}`}
                            onChange={(e) => handleCollaborationChange(type, e.target.value, true)}
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 项目信息 */}
              <div className="space-y-4">
                <div>
                  <Label>项目描述</Label>
                  <Textarea
                    placeholder="请输入项目描述"
                    value={formData.projectDescription}
                    onChange={(e) => handleChange('projectDescription', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>游戏商店链接</Label>
                  <Input
                    placeholder="请输入游戏商店链接"
                    value={formData.playStoreLink}
                    onChange={(e) => handleChange('playStoreLink', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* 日期选择 */}
              <div className="grid grid-cols-2 gap-4">
  <div className="relative group">
    <Label 
      htmlFor="start-date" 
      className={`${labelClassName} block`}
    >
      开始日期
    </Label>
    <div className="relative mt-1">
      <Input
        id="start-date"
        type="date"
        value={formData.dateRange.start}
        onChange={(e) => handleChange('dateRange', {...formData.dateRange, start: e.target.value})}
        className={`${inputClassName} pl-10 w-full`}
      />
      <CalendarIcon 
        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors"
        onClick={() => {
          document.getElementById('start-date')?.showPicker?.() || 
          document.getElementById('start-date')?.click();
        }}
      />
    </div>
  </div>

  <div className="relative group">
    <Label 
      htmlFor="end-date" 
      className={`${labelClassName} block`}
    >
      结束日期
    </Label>
    <div className="relative mt-1">
      <Input
        id="end-date"
        type="date"
        value={formData.dateRange.end}
        onChange={(e) => handleChange('dateRange', {...formData.dateRange, end: e.target.value})}
        className={`${inputClassName} pl-10 w-full`}
      />
      <CalendarIcon 
        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors"
        onClick={() => {
          document.getElementById('end-date')?.showPicker?.() || 
          document.getElementById('end-date')?.click();
        }}
      />
    </div>
  </div>
</div>

              {/* 联系人信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>收件人</Label>
                  <Input
                    placeholder="请输入收件人姓名"
                    value={formData.recipient}
                    onChange={(e) => handleChange('recipient', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>发件人</Label>
                  <Input
                    placeholder="请输入发件人姓名"
                    value={formData.senderName}
                    onChange={(e) => handleChange('senderName', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 其他场景的表单 */}
          {scenario !== 'initial' && (
            <div className="space-y-4">
              <Input
                placeholder="运营姓名"
                value={formData.userName}
                onChange={(e) => handleChange('userName', e.target.value)}
              />
              <Input
                placeholder="网红用户名"
                value={formData.influencerName}
                onChange={(e) => handleChange('influencerName', e.target.value)}
              />
              {scenario === 'negotiation' && (
                <Input
                  placeholder="期望价格"
                  value={formData.expectedPrice}
                  onChange={(e) => handleChange('expectedPrice', e.target.value)}
                />
              )}
              {['followup', 'negotiation'].includes(scenario) && (
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                />
              )}
            </div>
          )}

          {/* 生成邮件按钮 */}
          <Button 
            className="w-full" 
            onClick={() => {
              const content = emailTemplates[scenario as keyof typeof emailTemplates](formData);
              setEmailContent(content);
              setShowEmail(true);
            }}
          >
            <Send className="w-4 h-4 mr-2" />
            生成邮件
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailAssistant;