




export async function GET(request: any) {
    console.log("");
    return new Response(JSON.stringify({ message: `Hello from the backend!${request.name}` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}