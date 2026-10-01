// Always includes the current assignee so a select never silently shows the wrong value
// while users are loading or when the assignee falls outside the fetched page.
export function AssigneeOptions({ users = [], currentAssignee = null }) {
  const includesCurrent = !currentAssignee || users.some((user) => user.id === currentAssignee.id);
  const options = includesCurrent ? users : [currentAssignee, ...users];

  return (
    <>
      <option value="">Unassigned</option>
      {options.map((user) =>
      <option key={user.id} value={user.id}>
          {user.name}
        </option>
      )}
    </>);

}