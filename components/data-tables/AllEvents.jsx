import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import IconPencil from "@/components/Icon/IconPencil";
import IconTrashLines from "@/components/Icon/IconTrashLines";
import { useRouter } from "next/router";
import Link from "next/link";

const rowData1 = [
  {
    id: 1,
    firstName: "Caroline",
    lastName: "Jensen",
    email: "carolinejensen@zidant.com",
    dob: "2004-05-28",
    address: {
      street: "529 Scholes Street",
      city: "Temperanceville",
      zipcode: 5235,
      geo: {
        lat: 23.806115,
        lng: 164.677197,
      },
    },
    phone: "+1 (821) 447-3782",
    isActive: true,
    age: 39,
    company: "POLARAX",
  },
  {
    id: 2,
    firstName: "Celeste",
    lastName: "Grant",
    email: "celestegrant@polarax.com",
    dob: "1989-11-19",
    address: {
      street: "639 Kimball Street",
      city: "Bascom",
      zipcode: 8907,
      geo: {
        lat: 65.954483,
        lng: 98.906478,
      },
    },
    phone: "+1 (838) 515-3408",
    isActive: false,
    age: 32,
    company: "MANGLO",
  },
];

const AllEvents = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const getAllEventsData = async () => {
      const response = await fetch(
        "http://localhost:4000/api/events/create-event",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRowData(data);
      }
    };

    getAllEventsData();
  }, []);

  console.log(rowData);
  console.log(rowData1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle(`Add Events`));
  });
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(rowData, "id"));
  const [recordsData, setRecordsData] = useState(initialRecords);

  const [search, setSearch] = useState("");
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "id",
    direction: "asc",
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    setInitialRecords(() => {
      return rowData.filter((item) => {
        return (
          item.id.toString().includes(search.toLowerCase()) ||
          item.event_name.toLowerCase().includes(search.toLowerCase()) ||
          item.slug.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.phone.toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  }, [search, rowData]);
  console.log(initialRecords);
  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);

  const formatDate = (date) => {
    const dateArray = date.split("T");
    const formattedDate = `${dateArray[0]} ${dateArray[1].split(".").shift()}`;
    return formattedDate;
  };

  return (
    <div>
      <div className="panel mt-6">
        <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
          <h5 className="text-lg font-semibold dark:text-white-light">
            Order Sorting
          </h5>
          <div className="ltr:ml-auto rtl:mr-auto">
            <input
              type="text"
              className="form-input w-auto"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="datatables">
          <DataTable
            highlightOnHover
            className={`${
              isRtl
                ? "table-hover whitespace-nowrap"
                : "table-hover whitespace-nowrap"
            }`}
            records={recordsData}
            columns={[
              { accessor: "id", title: "ID", sortable: true },
              { accessor: "event_name", title: "First Name", sortable: true },
              { accessor: "slug", title: "Event Slug", sortable: true },
              {
                accessor: "created_at",
                title: "Created at",
                sortable: true,
                render: (data) => formatDate(data.created_at),
              },
              {
                accessor: "slug",
                title: "Link",
                sortable: true,
                render: (data) => (
                  <a
                    href={`/${data.slug}`}
                    className="text-sky-700 hover:text-sky-500 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.slug}
                  </a>
                ),
              },
              {
                title: "Action",
                render: (data) => (
                  <Link href="/">
                    <IconPencil className="text-green-700" />
                  </Link>
                ),
              },
            ]}
            totalRecords={initialRecords.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            minHeight={200}
            paginationText={({ from, to, totalRecords }) =>
              `Showing  ${from} to ${to} of ${totalRecords} entries`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AllEvents;
