'use client'
import { NextResponse } from "next/server";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Button, CardActions } from "@mui/material"; // Import Material-UI components
import { Newspaper } from '@mui/icons-material';


type WSResults = {
	title: string;
	imageUrl: string;
	url: string;
};

export default function Home() {
	const [searchResults, setSearchResults] = useState<WSResults[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				const res = await fetch("/searchprod", {
					method: "POST",
					body: JSON.stringify({ searchPrompt: "" }),
					headers: {
						"Content-Type": "application/json",
					},
				});
				const { products } = await res.json();

				console.log(products);
				setSearchResults(products);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching search results:", error);
				setIsLoading(false);
			}
		};

		fetchSearchResults();
	}, []);

	return (
		<Grid container sx={{ padding: 8 }}>
			<Typography variant="h2" component="div" sx={{ marginY: '0.5em', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
				<Newspaper sx={{ fontSize: '5rem', marginRight: '0.2em', color: 'indianred' }} />
				輔大趨勢 GOGO
			</Typography>
			<div>
				{isLoading && <h6 className="text-white">載入中請稍後...</h6>}
			</div>
			<Grid container spacing={2}>
				{searchResults?.map((prod, i) => (
					<Grid item xs={4} key={i} >
						<Card sx={{ height: '280px'}}>
							<CardMedia
								component="img"
								alt={prod.title}
								height="150"
								image={prod.imageUrl} // Assuming the image URL is stored in the imageUrl property
							/>
							<CardContent>
								<Typography gutterBottom component="div">
									{prod.title.length > 100
										? `${prod.title.substring(0, 100)}…`
										: prod.title}
								</Typography>
							</CardContent>
							<CardActions sx={{ marginTop: -1 }}>
								<Button size="small" href={prod.url} target="_blank" rel="noopener noreferrer">
									了解更多
								</Button>
							</CardActions>
						</Card>
					</Grid>
				))}
			</Grid>
		</Grid>
	);
}
