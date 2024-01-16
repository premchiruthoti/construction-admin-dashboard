import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
import IconPencil from "../Icon/IconPencil";

const ManageEditionsTable = () => {
  const [rowData, setRowData] = useState([]);

  const router = useRouter();
  const eventSlug = router.query.events;

  const submitForm = (values) => {
    const toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
    });
    toast.fire({
      icon: "success",
      title: values,
      padding: "10px 20px",
    });
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Manage Editions"));
  });
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;

  useEffect(() => {
    const getEventsEditionData = async () => {
      const response = await fetch(
        `http://localhost:4000/api/events/manage-editions?slug=${eventSlug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setRowData(data);
      }
    };

    getEventsEditionData();
  }, [eventSlug]);

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
          item.year.toLowerCase().includes(search.toLowerCase()) ||
          item.city.toLowerCase().includes(search.toLowerCase()) ||
          item.short_name.toLowerCase().includes(search.toLowerCase())
        );
      });
    });
  }, [search, rowData]);

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);

  const getDate = (startDate, endDate) => {
    const modifiedStartDate = new Date(startDate);
    const modifiedEndDate = new Date(endDate);
    const startDateArray = modifiedStartDate.toString().split(" ");
    const endDateArray = modifiedEndDate.toString().split(" ");
    if (startDateArray[1] === endDateArray[1]) {
      const modifiedDate = `${startDateArray[1]} ${startDateArray[2]}-${endDateArray[2]}, ${endDateArray[3]}`;
      return modifiedDate;
    } else {
      const modifiedDate = `${startDateArray[1]} ${startDateArray[2]}-${endDateArray[1]} ${endDateArray[2]}, ${endDateArray[3]}`;
      return modifiedDate;
    }
  };

  const getCurrentEdition = (startDate) => {
    const currentDate = new Date();
    const eventDate = new Date(startDate);
    if (eventDate > currentDate) {
      return true;
    }
  };

  const isFeaturedChangeHandler = async (event, eventId) => {
    const data = {
      eventId: eventId,
      isFeatured: event.target.checked,
    };
    const response = await fetch("/api/events/manage-editions", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      submitForm(data.message);
    }
  };

  const featuredInPastEventChangeHandler = async(event, eventId) => {
    const data = {
      eventId: eventId,
      featuredInPastEvent: event.target.checked,
    };
    const response = await fetch("/api/events/manage-editions", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      submitForm(data.message);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
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
          className={"table-hover whitespace-nowrap"}
          records={recordsData}
          columns={[
            { accessor: "id", title: "ID", sortable: true },
            { accessor: "year", title: "Year / Edition", sortable: true },
            {
              accessor: "",
              title: "Date",
              sortable: true,
              render: (data) => `${getDate(data.start_date, data.end_date)}`,
            },
            {
              accessor: "",
              title: "Venue",
              sortable: true,
              render: (data) => `${data.city}, ${data.country}`,
            },
            { accessor: "short_name", title: "Short Name", sortable: true },
            {
              accessor: "is_featured",
              title: "Is Features",
              render: (data) => (
                <label
                  className="relative h-6 w-12"
                  key={`is_featured-${data.id}`}
                >
                  <input
                    type="checkbox"
                    className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                    id="custom_switch_checkbox1"
                    defaultChecked={data.is_featured === 1 ? true : false}
                    onChange={(event) => {
                      isFeaturedChangeHandler(event, data.id);
                    }}
                  />
                  <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                </label>
              ),
            },
            {
              accessor: "featured_in_past_event",
              title: "Past Event Page",
              render: (data) =>
                getCurrentEdition(data.start_date) === true ? (
                  <button type="button" className="btn btn-danger btn-sm">
                    Current Edition
                  </button>
                ) : (
                  <label
                    className="relative h-6 w-12"
                    key={`featured_in_past_event-${data.id}`}
                  >
                    <input
                      type="checkbox"
                      className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                      id="custom_switch_checkbox2"
                      onChange={(event) => {
                        featuredInPastEventChangeHandler(event, data.id);}}
                      defaultChecked={
                        data.featured_in_past_event === 1 ? true : false
                      }
                    />
                    <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                  </label>
                ),
            },
            {
              accessor: "phone",
              title: "Action",
              render: (data) => (
                <Link
                  href={{
                    pathname: "/[events]/manage-editions/edit/[eventId]",
                    query: { events: eventSlug, eventId: data.id },
                  }}
                >
                  <IconPencil className="text-green-600" />
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
  );
};

export default ManageEditionsTable;
