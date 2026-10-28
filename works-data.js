// caption は作品に紐づく短い説明。最初の作品は見開き右ページの独立したトーン領域に表示されます。
// スマホでは画像の下に表示。不要なら空文字にしてください。
// description は作品をクリックしたときの説明文です。
// 作品を増やす場合は、この配列に同じ形式で追加します。
// 将来的には、この部分をCMSに接続する予定です。
// layout は PC版の各コマ内で画像の「枠」を調整する設定です。
// width / height: コマ内の大きさ(15〜100%)、left / top: 余白の寄せ位置(0左上〜100右下)
// imageX / imageY: 画像を切り取る中心位置(0〜100)。画像自体の加工はしません。
// 例: layout: { width: 80, height: 90, left: 50, top: 50, imageX: 40, imageY: 25 }
// 変更しなければ初期値 (大きさ100%、左上寄せ、画像中央) が適用されます。
window.WORKS_DATA = [
  { title: 'WORK 01', image: 'assets/nagan01.jpeg', year: '2026', description: '作品紹介文の仮テキスト', caption: '', layout: { width: 100, height: 100, left: 0, top: 0, imageX: 50, imageY: 50 } },
  { title: 'WORK 02', image: 'assets/nagan02.jpeg', year: '2026', description: '目が合っちゃった女の子', caption: '', layout: { width: 100, height: 100, left: 0, top: 0, imageX: 50, imageY: 20 } },
  { title: 'WORK 03', image: 'assets/nagan03.jpeg', year: '2026', description: '同じクラスの気になる娘', caption: '', layout: { width: 100, height: 100, left: 0, top: 0, imageX: 50, imageY: 50, imageScale: 1.2 } },
  { title: 'WORK 04', image: 'assets/nagan04.jpeg', year: '2026', description: '作品紹介文の仮テキスト', caption: '', layout: { width: 100, height: 100, left: 0, top: 0, imageX: 50, imageY: 20 } },
  { title: 'WORK 05', image: 'assets/nagan-kimikiba.jpeg', year: '2026', description: 'マンガワン「マンガイチ」11月期佳作｜「君の牙を見せてくれ」', caption: 'マンガワン「マンガイチ」11月期佳作', layout: { width: 100, height: 100, left: 0, top: 0, imageX: 50, imageY: 50 } }
];
