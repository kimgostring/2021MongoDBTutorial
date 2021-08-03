console.log("client code running.");
const axios = require("axios");
const URI = "http://localhost:3000";

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

test();
