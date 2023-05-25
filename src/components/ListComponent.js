import styled from "styled-components";
import { useRecoilValue } from "recoil";

const ListComponent = () => {
    return <Main>List</Main>;
};

export default ListComponent;

const Main = styled.div`
    background: red;
    width: 30vw;
    height: 60vh;
`;
