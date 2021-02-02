import React from 'react';
import Image from 'next/image'
import Link from "next/link";

import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 200,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },

}));

export interface ProductCardProps {
    id: number,
    name: string,
    price: number,
    photoUrl: string,
    details?: string
}

export default function ProductCard({id, name, price, photoUrl, details}: ProductCardProps) {
    const classes = useStyles();

    return (
        <Link href={`/item/${id}`}>
            <Card className={classes.root} elevation={4}>
                <Image
                    className={classes.media}
                    src={photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_X_vector.svg/1200px-IPhone_X_vector.svg.png"}
                    title="Paella dish"
                    width={100}
                    height={100}
                />
                <CardHeader
                    title={name || "Iphone 13"}
                    subheader={`${price || 10000} KZT`}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {details || "fake data here"}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}
