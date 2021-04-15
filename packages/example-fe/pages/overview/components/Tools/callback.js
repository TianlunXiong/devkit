export default () => {
  let device_type = null;
  if (
    navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|MQQBrowser)/i,
    )
  ) {
    device_type = 'i';
  } else {
    device_type = 'www';
  }
  window.addEventListener('lx_load', () => {
    const { renderTime, LXAnalytics, cid, custom } = window;
    if (custom) {
      custom.response_time = `${renderTime}`;
      custom.device_type = device_type;
      const valLab = {
        custom,
      };
      LXAnalytics(
        'moduleView',
        'b_movie_m_gydl8oth_mv',
        valLab,
        {
          cid,
        });
    }
  });
  window.addEventListener('lx_postModuleResponse', (e) => {
    const { moduleId, moduleName, response_time } = e;
    const { LXAnalytics, cid, custom: oldCustom } = window;
    if (oldCustom) {
      const custom = { ...oldCustom };
      custom.moduleName = moduleName;
      custom.moduleId = moduleId;
      custom.response_time = `${response_time}`;
      custom.device_type = device_type;
      const valLab = {
        custom,
      };
      // console.log(valLab);
      LXAnalytics(
        'moduleView',
        'b_movie_m_gydl8oth_mv',
        valLab,
        {
          cid,
        },
      );
    }
  });
  window.addEventListener('lx_downloadModule', (e) => {
    const { moduleId, moduleName, response_time } = e;
    const { LXAnalytics, cid, custom: oldCustom } = window;
    if (oldCustom) {
      const custom = { ...oldCustom };
      custom.moduleName = moduleName;
      custom.moduleId = moduleId;
      custom.device_type = device_type;
      // custom.response_time = `${response_time}`;
      const valLab = {
        custom,
      };
      // console.log(valLab);
      LXAnalytics(
        'moduleView',
        'b_movie_m_rwapnr4h_mv',
        valLab,
        {
          cid,
        },
      );
    }
  });
};
