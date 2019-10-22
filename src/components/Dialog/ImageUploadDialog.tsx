/**
 * @name ImageUploadDialog
 * @description Dialog for uploading cropped image
 * @version 1.0
 * @todo flexible(for example ratio as props)
 * @author Darko
 */
import * as React from 'react';

// material ui components & icons
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// component styles
const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    content: {
        textAlign: 'left',
        padding: theme.spacing(1),
        minWidth: 800,
        maxWidth: 960
    },
    preview: {
        display: 'flex',
        justifyContent: 'center',
        height: 240,
        margin: theme.spacing(2, 0)
    },
    avatar: {
        width: 240,
        height: 240,
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileUpload: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1)
    },
    button: {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.light,
        color: '#FFFFFF',
        width: 120,
        margin: theme.spacing(1),
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: '#FFFFFF',
        },
    }
});

type IUDStatus = 'ready' | 'loaded';

export interface IIUDProps extends StyledComponentProps {
    open: boolean;
    name: string;
    onYes: (url: string) => Promise<any> | void;
    onCancel: () => void;
    url?: string;
    yes?: string;
    ok?: string;
    cancel?: string;
    title?: string;
    message?: string | React.ReactNode;
}

export interface IIUDState {
    busy: boolean;
    photoURL?: string;
    status: IUDStatus;
    crop: { unit: string, height: number, aspect: number };
}

export class ImageUploadDialog extends React.Component<IIUDProps, IIUDState> {

    constructor(props: Readonly<IIUDProps>) {
        super(props);

        this.state = {
            busy: false,
            photoURL: props.url,
            status: 'ready',
            crop: {
                unit: "%",
                height: 100,
                aspect: 1
            }
        }
    }

    imageRef = undefined;
    fileURL = undefined;
    croppedURL = undefined;

    static defaultProps = {
        title: 'Upload Image',
        yes: 'Yes',
        ok: 'OK',
        cancel: 'Cancel'
    };


    handleFileOpened = (e) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            this.setState({
                photoURL: reader.result as string,
                status: 'loaded'
            })
        });
        reader.readAsDataURL(e.target.files[0]);
    }

    onImageLoaded = image => {
        this.imageRef = image;
    }

    getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                // if (!blob) {
                //     reject(new Error('Canvas is empty'));
                //     return;
                // }
                // blob.name = fileName;
                window.URL.revokeObjectURL(this.fileURL);
                this.fileURL = window.URL.createObjectURL(blob);
                resolve(this.fileURL);
            }, "image/jpeg");
        });
    }

    makeClientCrop = async crop => {
        if (this.imageRef && crop.width && crop.height) {
            this.setState({ busy: true });
            // try {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "new_image.jpeg"
            );

            this.croppedURL = croppedImageUrl;
            this.setState({ busy: false });
            // } catch (error) {
            //     console.log('IUD.makeClientCrop: ', error);
            //     this.setState({ busy: false });
            // }
        }
    }

    onCropComplete = async crop => {
        await this.makeClientCrop(crop);
    };

    onCropChange = (crop) => {
        this.setState({ crop });
    };


    render() {
        const { open, onCancel, onYes, title, classes, message, name, cancel, ok } = this.props;
        const { busy, photoURL, crop, status } = this.state;
        return (
            <Dialog
                open={open}
                onClose={onCancel}
                aria-labelledby="image-upload-dialog-title"
                maxWidth='md'
            >
                <DialogTitle id="image-upload-dialog-title">{title}</DialogTitle>
                <DialogContent className={classes.content}>
                    {message && (
                        <DialogContentText id="image-upload-dialog-description">
                            {message}
                        </DialogContentText>
                    )}
                    <Box id='image-upload-dialog-preview' className={classes && classes.preview}>
                        {status === 'ready' && !!photoURL && (
                            <img alt='cropped-avatar' className={classes && classes.avatar} src={photoURL} />
                        )}
                        {status === 'loaded' && !!photoURL && (
                            <ReactCrop
                                src={photoURL}
                                crop={crop}
                                onImageLoaded={this.onImageLoaded}
                                onComplete={this.onCropComplete}
                                onChange={this.onCropChange}
                            />
                        )}
                        {!photoURL && (
                            <Box className={classes && classes.avatar} id='image-upload-dialog-preview-box'>
                                <span style={{ fontSize: 32, color: 'white' }}>
                                    {name.slice(0, 1).toUpperCase()}
                                </span>
                            </Box>
                        )}
                    </Box>
                    <Box className={classes.fileUpload} id='image-upload-dialog-upload'>
                        <input
                            accept="image/*"
                            id="upload-file"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={this.handleFileOpened}
                            disabled={busy}
                        />
                        <label htmlFor="upload-file" style={{ display: 'inline' }}>
                            <Button
                                variant="contained"
                                component="span"
                            >
                                <CloudUploadIcon />
                                &nbsp;&nbsp;Upload a different photo
                                </Button>
                        </label>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {!!onCancel && (
                        <Button id='image-upload-button-cancel' onClick={onCancel} autoFocus className={classes.button}>
                            {cancel}
                        </Button>
                    )}
                    <Button
                        onClick={() => onYes(this.croppedURL)}
                        color="primary"
                        className={classes.button}
                        disabled={busy}
                    >
                        {ok}
                    </Button>
                </DialogActions>
            </Dialog >
        );
    }
}


export default withStyles(styles)(ImageUploadDialog);