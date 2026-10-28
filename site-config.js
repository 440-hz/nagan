// このファイルだけでサイト内の表示文言やSNSを変更できます。
// 公開される情報のみ記入してください。パスワード・秘密情報は記入しないでください。
window.SITE_CONFIG = {
  artistName: 'ながん',
  introduction: '漫画を描いています。\nイラスト制作のご依頼もお気軽にご相談ください。',
  // 画面に表示する文言（後から自由に変更可能）
  text: {
    genre: 'MANGA / ILLUSTRATION',
    coverTitle: 'WORKS',
    selectedWorks: 'ARTIST NAME',
    emptyPage: 'TO BE CONTINUED…',
    navWorks: 'WORKS',
    navAbout: 'ABOUT',
    navContact: 'CONTACT',
    aboutLabel: '01',
    aboutTitle: 'ABOUT',
    contactLabel: '02',
    contactTitle: 'CONTACT',
    contactIntro: 'お仕事のご依頼・お問い合わせは、XのDMまでお願いいたします。',
    footerEnding: ''
  },
  socialLinks: [
    { label: 'Instagram', url: '' },
    { label: 'X', url: 'https://x.com/nagannaganchan' }
  ],
  // デザイン確認中は true。実際に公開する前に友達に受付状況を確認してください。
  // 最後のコマの人物画像。今は仮画像です。友達の画像をMacで差し替えてください。
  endingArtwork: 'assets/nagan05.jpeg',
  // 「つづく」のコマ位置と大きさ。数字はすべて％（0〜100）です。
  // 幅＋左位置、高さ＋上位置が100を超えるとコマがページからはみ出すので注意。
  endingLayout: {
    width: 76,           // コマ幅（ページの76%）
    height: 59,          // コマ高さ（ページの59%）
    left: 0,             // 左からの位置（0%＝左端）
    top: 0,              // 上からの位置（0%＝上端）
    imageY: 37,          // イラストの縦方向のトリミング位置（0上・100下）
    bubbleWidth: 22,     // 吹き出し幅（コマに対する%）
    bubbleTop: 5,        // 吹き出しの上からの位置（%）
    bubbleRight: 5       // 吹き出しの右からの位置（%）
  },
  contactEmail: ''
};
