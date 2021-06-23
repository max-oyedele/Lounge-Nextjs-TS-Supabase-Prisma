import { GetServerSideProps } from 'next'

const IndexPage = () => {
  return <div></div>
}

export default IndexPage

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/admin/reservations',
      permanent: false,
    },
  }
}
