import React from 'react';
import axios from 'axios';
import {
  Header,
  List,
  Grid,
  Segment,
  Table,
  Divider,
  Image,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

class Beers extends React.Component {

  state = { visible: [], page: 1, totalPages: 0 }

  componentDidMount() {
    axios.get(`/api/all_beers?per_page=${10}`).then((res) => {this.setState({ totalPages: 7295, visible: res.data.entries }) })
  }

  loadMore = () => {
    const page = this.state.page + 1;
    axios.get(`/api/all_beers?page=${page}&per_page=${10}`)
    .then(res => { this.setState(
        { visible: [...this.state.visible, ...res.data.entries],
          page: this.state.page + 1,
        }
      );
      }
      );
  }

  render() {
    const { visible, page, totalPages } = this.state
    return (
      <div>
        <Header style={styles.masthead}>All Beers</Header>
        <Divider hidden />
        <Grid>
          <Grid.Column>
            <InfiniteScroll
                    pageStart={page}
                    loadMore={this.loadMore}
                    hasMore={page < totalPages}
                    useWindow={false}
            >
              <Table centered striped>
                <Table.Header>
                  <Table.HeaderCell>Icon</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Style</Table.HeaderCell>
                  <Table.HeaderCell>ABV</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  {visible.map( entry => (   
                  <Table.Row>
                    <Table.Cell>
                      {entry.hasOwnProperty('labels') && <Image src={entry.labels.icon} />}
                    </Table.Cell>
                    <Table.Cell verticalAlign='middle'>{entry.name_display}</Table.Cell>
                    {entry.hasOwnProperty('style') ? 
                      <Table.Cell verticalAlign='middle'>{entry.style.name}</Table.Cell>
                      :
                      <Table.Cell disabled verticalAlign='middle'>No data</Table.Cell>
                    }
                    <Table.Cell verticalAlign='middle'>{entry.abv} %</Table.Cell>
                  </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </InfiniteScroll>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

const styles = {
  masthead: {
    textAlign: 'center'
  }
}

export default Beers;