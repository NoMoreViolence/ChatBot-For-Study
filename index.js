const RtmClient = require('slack-client').RtmClient;
const WebClient = require('slack-client').WebClient;

// Slack Bot API Key
const token = 'xoxb-305247720368-Rxx2Xqj8MShCYcBzi23uQiqf';

// 웹 클라이언트와 슬렉 봇 클라이언트 정의
const web = new WebClient(token);
const rtm = new RtmClient(token, { logLevel: 'error' });
// 슬렉 봇 시작
rtm.start();

// 슬렉 클라이언트 재정의
const RTM_EVENTS = require('slack-client').RTM_EVENTS;

// JSON 파일 만들기: 음식점 모델
const Datafile = require('./DataFile.json');

// 대화 컨트롤 변수 paper: 대화 진전 확인 척도 파악 변수 area: 음식 장소 저장 변수, fastfood: fastfood 음식 섭취 여부
let paper = 0;
const Guidancelist = [
  '어디 역 주변의 음식을 드시겠어요?',
  '공덕 주변의 음식점으로 안내해 드릴게요',
  '애오개 주변의 음식점으로 안내해 드릴게요',
  '아현 주변의 음식점으로 안내해 드릴게요',
];
// 패스트 푸드점 진행
const Askfastfood = [' 패스트 푸드 정보입니다'];
const Thereisno = [
  '죄송하지만 애오개 역 주변에는 패스트 푸드점이 없습니다 일반 음식점만 안내해 드리겠습니다',
];

// 채팅 클라이언트 실행
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  const channel = message.channel;
  const user = message.user;
  const text = message.text;

  // 배고파 라는 문자를 찾아내서 temp에 위치를 줌
  temp = text.indexOf('배고파');
  // temp가 -1이 아닐 경우에는 배고파 라는 값이 들어갔고, paper 값도 0일때
  if (temp !== -1 && paper === 0) {
    // 어떤 역 주변의 음식을 먹을거냐고 질문
    web.chat.postMessage(channel, Guidancelist[0], { username: '음식알리미' });
    // 대화의 진전을 위해서 paper + 1
    paper = 1;
  }
  // 공덕 문자열 찾아내기
  temp = text.indexOf('공덕');
  // 공덕 문자가 있고 paer = 1
  if (temp !== -1 && paper === 1) {
    // 음식 알리미 실행
    web.chat.postMessage(channel, `공덕역 주변${Askfastfood}`, { username: '음식알리미' });
    // 패스트 푸드점 나열
    setTimeout(() => {
      for (key in Datafile.공덕.패스트푸드) {
        const mms = `${key} :  ${Datafile.공덕.패스트푸드[key]}`;
        web.chat.postMessage(channel, mms, { username: '음식알리미' });
      }
    }, 900);
    // 일반 음식점 안내 문구
    setTimeout(() => {
      web.chat.postMessage(channel, Guidancelist[1], { username: '음식알리미' });
    }, 1800);
    // 일반 음식점 나열
    setTimeout(() => {
      for (key in Datafile.공덕.일반음식점) {
        const mms = `${key} :  ${Datafile.공덕.일반음식점[key]}`;
        web.chat.postMessage(channel, mms, { username: '음식알리미' });
      }
    }, 2500);
    // 음식 알림이 끝났으므로 대회 진행 척도 0으로 돌아감
    paper = 0;
  }
  // 애오개 문자열 찾아내기
  temp = text.indexOf('애오개');
  // 애오개 문자가 있고 paer = 1
  if (temp !== -1 && paper === 1) {
    // 음식 알리미 실행
    web.chat.postMessage(channel, Thereisno[0], { username: '음식알리미' });
    // 일반 음식점 안내 문구
    setTimeout(() => {
      for (key in Datafile.애오개.일반음식점) {
        const mms = `${key} :  ${Datafile.애오개.일반음식점[key]}`;
        web.chat.postMessage(channel, mms, { username: '음식알리미' });
      }
    }, 1000);
    // 음식 알림이 끝났으므로 대회 진행 척도 0으로 돌아감
    paper = 0;
  }
  // 아현 문자열 찾아내기
  temp = text.indexOf('아현');
  // 아현 문자가 있고 paer = 1
  if (temp !== -1 && paper === 1) {
    // 음식 알리미 실행
    web.chat.postMessage(channel, `아현역 주변${Askfastfood}`, { username: '음식알리미' });
    // 패스트 푸드점 나열
    setTimeout(() => {
      for (key in Datafile.아현.패스트푸드) {
        const mms = `${key} :  ${Datafile.아현.패스트푸드[key]}`;
        web.chat.postMessage(channel, mms, { username: '음식알리미' });
      }
    }, 900);
    // 일반 음식점 안내 문구
    setTimeout(() => {
      web.chat.postMessage(channel, Guidancelist[3], { username: '음식알리미' });
    }, 1800);
    // 일반 음식점 나열
    setTimeout(() => {
      for (key in Datafile.아현.일반음식점) {
        const mms = `${key} :  ${Datafile.아현.일반음식점[key]}`;
        web.chat.postMessage(channel, mms, { username: '음식알리미' });
      }
    }, 2500);
    // 음식 알림이 끝났으므로 대회 진행 척도 0으로 돌아감
    paper = 0;
  }
});
