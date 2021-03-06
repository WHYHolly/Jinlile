import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Layout from '../components/layout'
import { Button, Container, Alert } from 'react-bootstrap'
import { withRouter } from "next/router";
import axios from "axios";
import withAuthentication from '../components/withAuthentication'

class Groups extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: [],
            alert: {
                show: false,
                content: '',
            }
        }
    }

    async componentDidMount() {
        let groups = await this.getGroups()
        this.setState({
            ...this.state,
            groups: groups
        })
    }

    async getGroups() {
        try{
            const user = JSON.parse(localStorage.getItem('user'))
            const uid = user._id;
            const { data } = await axios.get(`/users/${uid}`);
            localStorage.setItem('userName',data.name);
            const groups = data.groups ? data.groups : [];
            // return [
            //     { name: 'My Family', gid: 'myFamily' },
            //     { name: 'My Friends', gid: 'myFriends' },
            //     { name: 'Hiking Team', gid: 'hikingTeam' },
            //     { name: 'Colleagues', gid: 'colleagues' },
            // ]
            return groups;
        }catch (e) {
            console.log(e)
            switch(e.response.status) {
                case 404:
                    let { router } = this.props
                    router.replace('/')
                    break
                default:
                    console.log("error happens");
                    console.log(JSON.stringify(e));
            }
        }
        return []
    }

    handleGroupSelect(group) {
        localStorage.setItem('group', JSON.stringify(group));
        let { router } = this.props;
        router.push('/map');
    }

    selectGroups() {
        return (
            <>
                <p className="mt-4 text-muted">You have multiple groups. Please select one to continue... </p>
                <div>
                    <ListGroup className="mt-4" variant="flush">
                        {this.state.groups.map(group => (
                            <ListGroup.Item
                            as="div"
                            action={true}
                            key={group.groupName}
                            onClick={this.handleGroupSelect.bind(this, group)}
                            >
                                {group.groupName}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </>
        )
    }
    
    async create() {
        let groupName = window.prompt('Enter your group name:')
        if (groupName == null) {
            return
        }
        if (groupName == '') {
            return this.setState({
                alert: {
                    show: true,
                    content: 'Group name cannot be empty.',
                }
            })
        }
        try {
            let { data } = await axios.post(`/groups/${groupName}`)
            if (data.group) {
                return this.handleGroupSelect(data.group)
            }
            this.setState({
                alert: {
                    show: true,
                    content: data.msg
                }
            })
        }
        catch(e) {
            this.setState({
                alert: {
                    show: true,
                    content: e.message
                }
            })
        }

    }

    async join() {
        let groupName = window.prompt('Enter the group name you want to join')
        if (groupName == null) {
            return
        }
        if (groupName == '') {
            return this.setState({
                alert: {
                    show: true,
                    content: 'Group name cannot be empty'
                }
            })
        }
        try {
            let { data } = await axios.post(`/users/groups/${groupName}`)
            if (data.group) this.handleGroupSelect(data.group)
            else {
                this.setState({
                    alert: {
                        show: true,
                        content: data.msg
                    }
                })
            }
        }
        catch(e) {
            this.setState({
                alert: {
                    show: true,
                    content: e.message
                }
            })
        }
    }
    
    render() {
        return (
            <Layout>
                <Container>
                    <Alert dismissible onClose={() => this.setState({ alert: { show: false } })} className="mt-4" show={this.state.alert.show} variant="danger">{this.state.alert.content}</Alert>
                    {this.state.groups.length > 0 ? this.selectGroups() : ''}
                    <div className="mt-5">
                        <p className="text-muted">Want to have a new group?</p>
                        <Button onClick={() => this.create()} variant="dark" size="lg" className="btn-block">Create</Button>
                        <p className="text-muted mt-4">Or join a new group.</p>
                        <Button onClick={() => this.join()} variant="secondary" size="lg" className="btn-block">Join</Button>
                    </div>
                </Container>
            </Layout>
        )
    }
}

export default withAuthentication(withRouter(Groups))