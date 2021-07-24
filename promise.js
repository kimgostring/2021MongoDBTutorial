const addSum = (a, b) => {
    // 프로미스의 상태는 1. 대기 2. 이행 3. 실패
    // 1. 대기 - 처음에 프로미스 만들고 resolve() 또는 reject() 실행 전
    // 2. 이행 - resolve() 실행된 후
    // 3. 실패 - reject() 실행된 후
    // resolve() 또는 reject()가 하나라도 실행되면, 나머지 코드는 실행되지 않음
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number') reject('a, b must be numbers'); // reject(err)
            resolve(a + b); // resolve(value);
        }, 3000);
    }); 
};

addSum(1, 2)
    // 한 줄인 함수의 경우 return 필요 없음, 무조건 한 줄의 실행 결과 리턴하게 됨
    // 인자 하나일 경우 () 제거해도 됨
    .then(sum => console.log({ sum })) 
    .catch(err => console.log({ err }))
addSum('hello', 'hi')
    .then(sum => console.log({ sum }))
    .catch(err => console.log({ err }))

// 장점
// 1. 성공 처리와 에러 처리가 나뉘어져 있어 callback에 비해 실수 적음
// 2. resolve()가 실행되었다면 .then()을, reject()가 실행되었다면 .catch()를 실행 (깔끔)