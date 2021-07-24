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

// promise chaining - callback hell보다 깔끔 (점점 깊어지지 않음, 보다 명확)
addSum(1, 2)
    .then(sum1 => {
        console.log({ sum1 });
        return addSum(sum1, 15);
    })
    .then(sum2 => console.log({ sum2 }))
    .catch(err => console.log({ err })); // 아래에서 한 번만 오류 처리 해주면 됨