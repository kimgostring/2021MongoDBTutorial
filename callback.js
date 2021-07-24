const addSum = (a, b, callback) => { // 작업이 끝나면 callback 인자로 넘겨받은 함수 호출하게 됨
    setTimeout(() => {
        // 오류 있는 경우, 콜백의 첫 인자로 오류 메세지 (혹은 err 객체) 전달
        // 오류 처리 코드를 위에 적기, return으로 빠져나오기
        if (typeof a !== 'number' || typeof b !== 'number') return callback('a, b must be numbers'); 
        // 오류 없는 경우, 첫 인자로 null 전달
        callback(null, a + b);
    }, 3000);
}; 

addSum(1, 2, (err1, sum1) => {
    if (err1) return console.log({ err1 });
    console.log({ sum1 });

    // callback hell - 콜백이 계속 깊어지는 (nesting) 현상
    addSum(sum1, 15, (err2, sum2) => {
        if (err2) return console.log({ err2 });
        console.log({ sum2 });
    });
}); 
