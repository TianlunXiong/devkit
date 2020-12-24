export type DocUnit = {
  key: string,
  name: string,
  module: () => Promise<{ default: string }>,
}

const DOCUMENT = {
  documents: [
    // {
    //   key: 'introduce',
    //   name: '关于M5',
    //   module: () => import('./introduce.md'),
    // },
    {
      key: 'quick-start',
      name: '快速上手',
      module: () => import('./quick-start.md'),
    },
  ],
  components: {
    general: [
      {
        key: 'button',
        name: '按钮',
        module: () => import('./components/button.md'),
      },
      {
        key: 'icon',
        name: '图标',
        module: () => import('./components/icon.md'),
      },
    ],
    form: [
      {
        key: 'input',
        name: '文本框',
        module: () => import('./components/input.md'),
      },
      {
        key: 'radio',
        name: '单选框',
        module: () => import('./components/radio.md'),
      },
      {
        key: 'checkbox',
        name: '复选框',
        module: () => import('./components/checkbox.md'),
      },
      {
        key: 'picker',
        name: '选择器',
        module: () => import('./components/picker.md'),
      },
      {
        key: 'stack-picker',
        name: '层叠选择器',
        module: () => import('./components/stack-picker.md'),
      },
      {
        key: 'date-picker',
        name: '日期选择器',
        module: () => import('./components/date-picker.md'),
      },
      {
        key: 'calendar',
        name: '日历',
        module: () => import('./components/calendar.md'),
      },
      {
        key: 'slider',
        name: '滑动输入条',
        module: () => import('./components/slider.md'),
      },
      {
        key: 'stepper',
        name: '步进器',
        module: () => import('./components/stepper.md'),
      },
      {
        key: 'switch',
        name: '开关',
        module: () => import('./components/switch.md'),
      },
      {
        key: 'search-bar',
        name: '搜索栏',
        module: () => import('./components/search-bar.md'),
      },
      {
        key: 'file-picker',
        name: '文件选择器',
        module: () => import('./components/file-picker.md'),
      },
      {
        key: 'keyboard',
        name: '虚拟键盘',
        module: () => import('./components/keyboard.md'),
      },
    ],
    feedback: [
      {
        key: 'action-sheet',
        name: '动作面板',
        module: () => import('./components/action-sheet.md'),
      },
      {
        key: 'message',
        name: '消息',
        module: () => import('./components/message.md'),
      },
      {
        key: 'modal',
        name: '模态框',
        module: () => import('./components/modal.md'),
      },
      {
        key: 'toast',
        name: '轻提示',
        module: () => import('./components/toast.md'),
      },
      {
        key: 'loading',
        name: '加载',
        module: () => import('./components/loading.md'),
      },
      {
        key: 'pull',
        name: '上拉加载下拉刷新',
        module: () => import('./components/pull.md'),
      },
      {
        key: 'swipe-action',
        name: '滑动操作',
        module: () => import('./components/swipe-action.md'),
      },
      {
        key: 'activity-indicator',
        name: '活动指示器',
        module: () => import('./components/activity-indicator.md'),
      },
      {
        key: 'popup',
        name: '弹出框',
        module: () => import('./components/popup.md'),
      },
      {
        key: 'popper',
        name: '气泡层',
        module: () => import('./components/popper.md'),
      },
    ],
    view: [
      {
        key: 'collapse',
        name: '折叠面板',
        module: () => import('./components/collapse.md'),
      },
      {
        key: 'badge',
        name: '徽标',
        module: () => import('./components/badge.md'),
      },
      {
        key: 'cell',
        name: '列表项',
        module: () => import('./components/cell.md'),
      },
      {
        key: 'carousel',
        name: '走马灯',
        module: () => import('./components/carousel.md'),
      },
      {
        key: 'progress',
        name: '进度条',
        module: () => import('./components/progress.md'),
      },
      {
        key: 'notice-bar',
        name: '通告栏',
        module: () => import('./components/notice-bar.md'),
      },
      {
        key: 'panel',
        name: '面板',
        module: () => import('./components/panel.md'),
      },
      {
        key: 'marquee',
        name: '滚动',
        module: () => import('./components/marquee.md'),
      },
      {
        key: 'tooltip',
        name: '文字提示',
        module: () => import('./components/tooltip.md'),
      },
      {
        key: 'image-preview',
        name: '图片预览',
        module: () => import('./components/image-preview.md'),
      },
    ],
    navigation: [
      {
        key: 'tabs',
        name: '标签页',
        module: () => import('./components/tabs.md'),
      },
      {
        key: 'nav-bar',
        name: '导航栏',
        module: () => import('./components/nav-bar.md'),
      },
      {
        key: 'tab-bar',
        name: '标签栏',
        module: () => import('./components/tab-bar.md'),
      },
    ],
    other: [
      {
        key: 'mask',
        name: '遮罩层',
        module: () => import('./components/mask.md'),
      },
      {
        key: 'locale-provider',
        name: '国际化',
        module: () => import('./components/locale-provider.md'),
      },
      // {
      //   key: 'drag',
      //   name: '拖拽',
      //   module: () => import('./components/drag.md'),
      // },
      {
        key: 'back-to-top',
        name: '返回顶部',
        module: () => import('./components/back-to-top.md'),
      },
    ],
  },
};

export default DOCUMENT