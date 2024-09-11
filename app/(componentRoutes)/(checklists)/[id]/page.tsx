import Checklist from "./components/Checklist"

const ChecklistPage = ({ params }: { params: { id: string } }) => {
  return <Checklist params={params} />
}

export default ChecklistPage
