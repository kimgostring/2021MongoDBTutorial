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

// 장점
// 1. promise 다음에 나온 문법, promise보다 간단해짐
// 2. promise의 경우 뒤쪽 .then()에서 앞쪽 .then()에 사용된 값을 접근하려면 부모 스코프에 변수를 새로 생성해야 함 (번거로움)
const totalSum = async () => {
    try {
        let sum = await addSum(1, 2);
        sum = await addSum(sum, 15);
        console.log({ sum });
    } catch (err) {
        console.log(err);
    }
}

totalSum();