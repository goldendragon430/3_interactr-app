import React from 'react';
import styles from './EncodingStatusUpdater.module.scss';
import cx from 'classnames';
import {error} from 'utils/alert';
import ReactTooltip from "react-tooltip";


const EncodingStatusUpdater = ({task}) => {

    return (
      <span>{task.status}: {task.percent}%</span>
    )
}




class __EncodingStatusUpdater extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            percent: 1,
            status: 'queued',
            error: false,
            errorMessage: '',
            failed: false,
            serverError: false,
            timeout: 20000,
            reEncode: false
        };
    }

    componentDidMount(){
        if (!this.state.reEncode && !this.props.isLegacyProject) {
            this.updateEncodingStatus();
        }
    }

    internalServerError = ({message}) => {
        return message && (message === 'No token or id provided' || message === "CURL: ");
    };

    handleQencodeResponseStatus = jsonRes => {
        this.setState(() =>{
            let status = 'Complete';

            if (this.internalServerError(jsonRes) || jsonRes.failed) {
                status = 'Failed';
            } else if (jsonRes.percent < 100) {
                status = 'Encoding';
            }

            return {status, reEncode: false}
        });

        if (this.internalServerError(jsonRes)) {
            this.setState({
                serverError: true,
                failed: true,
                errorMessage: 'Server Error'
            });

            clearInterval(this.countup);

            return;
        }

        if(jsonRes.percent > this.state.percent) {
            this.setState({
                percent: jsonRes.percent,
            })
        }

        if(jsonRes.percent === 100 || jsonRes.failed) {
            // Clear the countup if we're done or conversion failed
            clearInterval(this.countup);

        } else if(! this.countup) {
            // Only start this if it's  not already counting
            this.countup = setInterval(()=>{
                if(this.state.percent < 99) {
                    // increase up to 99
                    this.setState({
                        percent: this.state.percent + 1
                    })
                }else {
                    // stop counting at 99
                    clearInterval(this.countup);
                }
            }, 1500);
        }

        // If not complete query and not failed the API again in X seconds (set in the state)
        if(jsonRes.status !== 'completed' && ! jsonRes.failed && ! this.internalServerError(jsonRes)){
            this.timer = setTimeout(()=>{
                this.updateEncodingStatus();
            }, this.state.timeout);
        }

        if (jsonRes.failed) {
            this.setState({
                failed: true,
                errorMessage: jsonRes.error_description
            });
        }
    };

    updateEncodingStatus = () => {
        const endpoint = 'qencode/task';

        apis.phpApi(endpoint, {
            method: 'post',
            body: {
                media_id: this.props.id
            }
        })
            .then(res => res.json())
            .then(this.handleQencodeResponseStatus)
            .catch(err => {
                this.setState({error: true});
            });
    };

    componentWillUnmount(){
        clearTimeout(this.timer);
        clearInterval(this.countup);
    }

    reEncodeTask = () => {
        // TODO add re-encode button logic
        const endpoint = 'qencode/reEncode/task';

        this.setState({
            status: 'Encoding',
            failed: false
        });

        apis.phpApi(endpoint, {
            method: 'post',
            body: {
                media_id: this.props.id
            }
        })
            .then(res => res.json())
            .then(this.handleQencodeResponseStatus)
            .catch(err => {
                this.setState({failed: true});
            });
    }

    render(){
        const {percent, status, failed, errorMessage, serverError} = this.state;

        if(percent === 100) {
            clearTimeout(this.state.countup);
        }

        return (
            <div style={{paddingTop: '10px'}}>
                {!failed  ? (
                    <div className={styles.progress} data-progress={percent}>
                        <div className={cx(styles.progress_mask, styles.isFull)}>
                            <div className={styles.progress_fill}></div>
                        </div>
                        <div className={styles.progress_mask}>
                            <div className={styles.progress_fill}></div>
                        </div>
                    </div>
                ) : !serverError ? (
                    <div className={styles.failed} data-tip="Click to re-encode media" data-for='encoding-failed'>
                        <span onClick={this.reEncodeTask}>Encoding Error</span>
                        <ReactTooltip id='encoding-failed' />
                    </div>
                ) : (
                    <div className={styles.failed}>
                        <span>Server Error</span>
                    </div>
                )}

                <p className={styles.heading}><strong>{status === 'Failed' && !serverError ? 'Retry' : status}</strong></p>
            </div>
        );
    }

}

export default EncodingStatusUpdater;