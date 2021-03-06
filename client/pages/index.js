import React from 'react'
import { withRouter } from 'next/router'
import Layout from '../components/layout'
import Spinner from 'react-bootstrap/Spinner'
import axios from 'axios'

class Index extends React.Component {

    async componentDidMount() {
        const router = this.props.router
        let auth = await this.auth()
        if (auth == false) {
            router.replace('/login')
        }
        else {
            router.replace('/groups')
        }
    }

    async auth() {
        try {
            let { data } = await axios.get('/users/authenticated')
            return data.msg
        }
        catch(e) {
            return false
        }
    }

    render() {
        return (
            <Layout>
                <div id="spinner" className="d-flex justify-content-center align-items-center">
                    <Spinner className="" animation="border" />
                </div>
                <style jsx>{`
                    #spinner {
                        top: 0;
                        left: 0;
                        position: absolute;
                        height: 100%;
                        width: 100%;
                    }
                `}</style>
            </Layout>
        )
    }
}

export default withRouter(Index)