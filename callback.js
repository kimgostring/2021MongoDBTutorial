const addSum = (a, b, callback) => { // 작업이 끝나면 callback 인자로 넘겨받은 함수 호출하게 됨
    setTimeout(() => {
        // 오류 있는 경우, 콜백의 첫 인자로 오류 메세지 (혹은 err 객체) 전달
        // 오류 처리 코드를 위에 적기, return으로 빠져나오기
        if (typeof a !== 'number' || typeof b !== 'number') return callback('a, b must be numbers'); 
        // 오류 없는 경우, 첫 인자로 null 전달
        callback(null, a + b);
    }, 3000);
}; 

const callback = (err, sum) => {
    if (err) return console.log({ err });
    console.log({ sum });
}

addSum(1, 2, callback); // success
addSum('hello', 'hi', callback) // error
