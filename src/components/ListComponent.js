import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { List, ListProps } from "react-virtualized";

const tempData = [
    {
        id: 1,
        text: "Item 1",
    },
    {
        id: 2,
        text: "Item 2",
    },
    {
        id: 3,
        text: "Item 3",
    },
    {
        id: 4,
        text: "Item 4",
    },
    {
        id: 5,
        text: "Item 5",
    },
];

const ListComponent = () => {
    return (
      <Main>
        <List
          width={300}
          height={400}
          rowCount={tempData.length}
          rowHeight={30}
          rowRenderer={({ index, key, style }) => (
            <div key={key} style={style}>
              {tempData[index].text}
            </div>
          )}
        />
      </Main>
    );
};

export default ListComponent;

const Main = styled.div`
    background: white;
    width: 30%;
    height: calc(100vh - 87.6px);
`;
