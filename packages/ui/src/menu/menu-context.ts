import { createContext, Context } from 'react';
import { MenuMode } from './PropsType';
import { noop } from '../utils-pc';

export interface ContextType {
  mode?: MenuMode;
  inlineIndent?: number;
  openKeys: string[];
  selectedKeys: string[];
  inlineCollapsed?: boolean;
  toggleSelectedKeys: (itemKey: string) => void;
  toggleOpenKeys: (subMenuKey: string) => void;
}

export const initialContext: ContextType = {
  mode: MenuMode.inline,
  inlineIndent: 24,
  inlineCollapsed: false,
  openKeys: [],
  selectedKeys: [],
  toggleSelectedKeys: noop,
  toggleOpenKeys: noop,
};

const MenuContext: Context<ContextType> = createContext(initialContext);

export default MenuContext;
