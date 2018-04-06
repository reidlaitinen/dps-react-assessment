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
  Modal,
  Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

class Beers extends React.Component {

  state = { visible: [], page: 1, totalPages: 0, modalOpen: false, modalBeer: {} }

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
    });
  }

  toggleModal = (beer = {}) => {
    this.setState( state => {
      return { modalOpen: !this.state.modalOpen, modalBeer: beer }
    })
  }

  render() {
    let open = {}
    if (this.state.modalOpen) 
      open = { open: true }
    
    const { visible, page, totalPages, modalBeer } = this.state

    return (
      <div>
        <Modal dimmer='blurring' style={styles.modal} {...open} onClose={() => this.toggleModal()}>
          <Modal.Header>BEER INFO</Modal.Header>
          <Modal.Content image scrolling>
          {modalBeer.labels ? 
            <Image
              size='medium'
              src={modalBeer.labels.medium}
              wrapped
            />
          :
            <Icon name='beer' size='massive'/>
          }
            <Modal.Description>
              <Header>{modalBeer.name_display}</Header>
              {modalBeer.hasOwnProperty('style')
                ? <Header as='h4'>{modalBeer.style.name}</Header> 
                : <Header as='h4'><i>no style indicated</i></Header>
              }
              {modalBeer.hasOwnProperty('style')
                ? <p>{modalBeer.style.description}</p> 
                : <p><i>no description</i></p>
              }
            </Modal.Description>
          </Modal.Content>
        </Modal>
      <div>
        <Header style={styles.mastHead}>All Beers</Header>
        <Divider hidden />
        <Grid>
          <Grid.Column>
            <Table>
              <Table.Header>
                <Table.HeaderCell>Icon</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Style</Table.HeaderCell>
                <Table.HeaderCell>ABV</Table.HeaderCell>
              </Table.Header>
            </Table>
              <div style={styles.scroller}>
                <InfiniteScroll
                  pageStart={page}
                  loadMore={this.loadMore}
                  hasMore={page < totalPages}
                  useWindow={false}
                >
                <Table striped>
                  <Table.Body>
                    {visible.map( entry => (   
                    <Table.Row key={entry.id} style={styles.pointer} onClick={ () => this.toggleModal(entry)}>
                      <Table.Cell>
                        {entry.hasOwnProperty('labels') ? <Image src={entry.labels.icon} /> : <Icon name='beer' size='huge'/>}
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
            </div>
          </Grid.Column>
        </Grid>
      </div>
    </div>
    )
  }
}

const styles = {
  mastHead: {
    textAlign: 'center'
  },
  scroller: {
    height: '70vh',
    overflow: 'auto'
  },
  pointer: {
    cursor: 'pointer'
  },
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}

export default Beers;