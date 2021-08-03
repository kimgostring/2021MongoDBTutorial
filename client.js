console.log("client code running.");
const axios = require("axios");
const URI = "http://localhost:3000";

// 비효율적인 방법 :
//   - blogsLimit 10 : 3.5초
//   - blogsLimit 20 : 6.7초
// populate :
//   - 10 : 0.5초
//   - 20 : 1초
//   - 200 : 3초

const test = async () => {
  // 성능 체크
  console.time("loading time");
  // 여기 안에서 비동기적으로 백엔드 호출
  let {
    // 가져온 문서의 data 필드의 blogs 필드를 blogs라는 변수명으로 디스트럭처링
    data: { blogs },
  } = await axios.get(`${URI}/blogs`);

  console.timeEnd("loading time");
};

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
};

testGroup();
