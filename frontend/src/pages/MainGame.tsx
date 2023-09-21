import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Page from "src/components/Page";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export default function MainGame() {

    const { gameID } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const page_width = window.innerWidth;

    return (
        <Page title="Game">
        </Page>
    )
}