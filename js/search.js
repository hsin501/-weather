// 控制搜索列表
const searchList = document.querySelector('.search-list');
// 輸入框内容改變时，有城市關鍵字出现列表，没有則不出現列表
document.querySelector('.search-city').addEventListener('input', (e) => {
  if (e.target.value.length > 0) {
    searchList.classList.add('show');
  } else {
    searchList.classList.remove('show');
  }
});
// 輸入框失焦，隱藏搜索列表
document.querySelector('.search-city').addEventListener('blur', (e) => {
  // 延遲消失，保證點擊獲取到城市code後，再隱藏下拉列表
  setTimeout(() => {
    searchList.classList.remove('show');
  }, 500);
});
// 輸入框聚焦，顯示搜索列表
document.querySelector('.search-city').addEventListener('focus', (e) => {
  if (e.target.value.length > 0) {
    searchList.classList.add('show');
  }
});
