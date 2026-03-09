const About = () => {
  return (<>
    <section className="position-relative">
      <img src="https://storage.googleapis.com/vue-course-api.appspot.com/wind-api/1772827038079.jpg" className="w-100 h-450 object-fit-cover" alt="about-banner" />
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
      <div className="position-absolute top-50 start-50 translate-middle text-white text-center ls-sm">
        <h2 className="fs-2 fs-md-1">關於我們</h2>
        <p className="opacity-75 d-none d-md-block">傳承職人精神·用心呈現每一貫壽司</p>
      </div>
    </section>

    <main className="py-11 py-lg-15">
      <section className="container mb-10">
        <div className="row align-items-center g-5 g-md-6">
          <div className="col-lg-6">
            <img src="https://storage.googleapis.com/vue-course-api.appspot.com/wind-api/1772828153420.jpg" className="w-100 h-220 h-sm-424 object-fit-cover rounded" alt="craftsmanship" />
          </div>
          <div className="col-lg-6">
            <div className="px-4 px-md-8 px-lg-11">
              <h3 className="fs-4 fs-md-2 fw-bold mb-4">職人精神</h3>
              <p className="fs-md-5 text-secondary text-justify">
                我們相信壽司不只是料理，而是一門結合時間、技藝與食材的藝術。從每日清晨挑選最新鮮的漁獲，到細心掌握米飯溫度與醋香比例，每一步都體現對料理的尊重。
              </p>
              <p className="fs-md-5 text-secondary text-justify">
                在這裡，每一貫壽司都承載著職人的堅持，讓顧客品嚐到最純粹的日本料理。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mb-10">
        <div className="row align-items-center g-5 g-md-6">
          <div className="col-lg-6 order-lg-2">
            <img src="https://storage.googleapis.com/vue-course-api.appspot.com/wind-api/1772475525324.jpg" className="w-100 rounded" alt="sushi rolls" />
          </div>
          <div className="col-lg-6 order-lg-1">
            <div className="px-4 px-md-8 px-lg-11">
              <h3 className="fs-4 fs-md-2 fw-bold mb-4">堅持新鮮與品質</h3>
              <p className="fs-md-5 text-secondary text-justify">
                每日直送的海鮮，搭配經驗豐富的師傅手工製作，讓每一口都能吃到食材的鮮甜與職人的用心。
              </p>
              <p className="fs-md-5 text-secondary text-justify">
                我們重視每一個細節，從刀工到擺盤，力求完美呈現日本料理精神。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
          <div className="row align-items-center g-5 g-md-6">
            <div className="col-lg-6">
              <img src="https://storage.googleapis.com/vue-course-api.appspot.com/wind-api/1772788077203.jpg" className="w-100 h-220 h-sm-424 object-fit-cover rounded" alt="chef" />
            </div>
            <div className="col-lg-6">
              <div className="px-4 px-md-8 px-lg-11">
                <h3 className="fs-4 fs-md-2 fw-bold mb-4">主廚介紹</h3>
                <p className="fs-md-5 text-secondary text-justify">
                  主廚擁有超過 20 年日本料理經驗，曾於東京多家壽司名店學習，累積深厚的壽司技藝。
                </p>
                <p className="fs-md-5 text-secondary text-justify">
                  對於米飯溫度、魚片厚度與刀工極為講究，致力於呈現細膩且純粹的壽司風味。
                </p>
              </div>
            </div>
          </div>
      </section>
    </main>
  </>);
}

export default About;