import styled from 'styled-components';
import { Input } from 'antd';

export default styled(Input)`
  border: none;
  border-radius: 0;
  box-shadow: none!important;
  border-bottom: 1px solid #e0e6ed;
  input::-webkit-input-placeholder {
    color: #c1ccda;
  }
`;
