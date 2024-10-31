import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './utils/trpc';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: "Bearer" + localStorage.getItem("token"),
            };
          },
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <IndexPage />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App

function IndexPage(){

  const userQuery = trpc.user.signup.useMutation()

  if(userQuery.isLoading)
    return <div>Loading...</div>

  if(userQuery.isError)
    return <div>Internal Server Error</div>

  return (
    <div>
      <p>Hi {userQuery.data?.token}</p>
      <button
      onClick={() => userQuery.mutate({
        username : 'test',
        password : 'test'
      })}
      >Create</button>
       </div>
  )

}