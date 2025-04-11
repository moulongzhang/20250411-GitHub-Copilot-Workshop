document.addEventListener('DOMContentLoaded', function() {
  // 初期表示時にはステップ1をアクティブにする
  showStep('step1');
  
  // ナビゲーションリンクのクリックイベントを設定
  const stepLinks = document.querySelectorAll('.steps a');
  stepLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const stepId = this.getAttribute('href').replace('#', '');
      showStep(stepId);
    });
  });
  
  // メニューボタンのクリックイベント（モバイル表示用）
  const menuButton = document.getElementById('menu');
  if (menuButton) {
    menuButton.addEventListener('click', function(event) {
      event.preventDefault();
      toggleDrawer();
    });
  }
  
  // ワークショップ完了ボタンのクリックイベント
  const completeButton = document.getElementById('complete-workshop');
  if (completeButton) {
    completeButton.addEventListener('click', function() {
      alert('おめでとうございます！Copilot Metrics ダッシュボードのワークショップを完了しました。');
    });
  }
  
  // 進捗の自動保存
  window.addEventListener('beforeunload', function() {
    // ユーザーの進捗を保存
    const currentStep = document.querySelector('.step-section.active').id;
    localStorage.setItem('workshopProgress', currentStep);
  });
  
  // 前回の進捗を復元
  const savedProgress = localStorage.getItem('workshopProgress');
  if (savedProgress) {
    showStep(savedProgress);
  }
});

// 指定されたステップを表示する関数
function showStep(stepId) {
  // すべてのステップを非表示
  const allSteps = document.querySelectorAll('.step-section');
  allSteps.forEach(step => {
    step.classList.remove('active');
  });
  
  // すべてのナビゲーションリンクから active クラスを削除
  const allLinks = document.querySelectorAll('.steps a');
  allLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // 指定されたステップを表示
  const targetStep = document.getElementById(stepId);
  if (targetStep) {
    targetStep.classList.add('active');
    
    // ナビゲーションリンクをアクティブにする
    const targetLink = document.querySelector(`.steps a[href="#${stepId}"]`);
    if (targetLink) {
      targetLink.classList.add('active');
    }
    
    // スクロール位置をトップに戻す
    document.getElementById('steps').scrollTop = 0;
  }
}

// モバイル表示時のドロワー切り替え
function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  if (drawer) {
    drawer.classList.toggle('open');
  }
  
  // ドロワーが開いているときはボディのスクロールを禁止
  if (drawer && drawer.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// 残り時間の更新（もし必要であれば）
function updateRemainingTime() {
  // ワークショップの総時間（分）
  const totalWorkshopTime = 60;
  
  // 経過時間を計算（実際のアプリケーションでは開始時間を記録する必要があります）
  const startTime = localStorage.getItem('workshopStartTime');
  if (!startTime) {
    localStorage.setItem('workshopStartTime', Date.now().toString());
    return;
  }
  
  const elapsedMinutes = Math.floor((Date.now() - parseInt(startTime)) / (1000 * 60));
  const remainingMinutes = Math.max(0, totalWorkshopTime - elapsedMinutes);
  
  // 残り時間を表示
  const timeRemainingElement = document.querySelector('.time-remaining');
  if (timeRemainingElement) {
    timeRemainingElement.innerHTML = `<i class="material-icons">access_time</i>${remainingMinutes}分`;
  }
}

// 定期的に残り時間を更新
setInterval(updateRemainingTime, 60000); // 1分ごとに更新