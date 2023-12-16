'use client'
import { NextResponse } from "next/server";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Button, CardActions } from "@mui/material"; // Import Material-UI components

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
		<div>
			<div>
				{isLoading && <h2 className="text-white">Loading...</h2>}
			</div>



			<Grid container spacing={2} sx={{ padding: 4 }}>
				{searchResults?.map((prod, i) => (
					<Grid item xs={4} key={i}>
						<Card sx={{ maxWidth: 350 }}>
							<CardMedia
								component="img"
								alt={prod.title}
								height="220"
								image={prod.imageUrl} // Assuming the image URL is stored in the imageUrl property
							/>
							<CardContent>
								<Typography gutterBottom component="div">
									{prod.title.length > 18
										? `${prod.title.substring(0, 18)}…`
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
		</div>
	);
}
