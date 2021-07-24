console.log('start');

setTimeout(() => {
    console.log('your meal is ready!');
}, 3000); // 3초 뒤 콜백 호출

console.log('end');

// 동기 - start > ready > end (X)
// 비동기 - start > end > ready (O)