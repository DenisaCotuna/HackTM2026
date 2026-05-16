using Microsoft.AspNetCore.Mvc;

namespace StudentHousingTM.Controllers
{
    internal static class ApiResponse
    {
        internal static IActionResult Ok<T>(ControllerBase ctrl, T data)
            => ctrl.Ok(new { success = true, data });

        internal static IActionResult Created<T>(ControllerBase ctrl, T data)
            => ctrl.StatusCode(201, new { success = true, data });

        internal static IActionResult NotFound(ControllerBase ctrl, string message)
            => ctrl.NotFound(new { success = false, message });

        internal static IActionResult BadRequest(ControllerBase ctrl, string message)
            => ctrl.BadRequest(new { success = false, message });

        internal static IActionResult ServerError(ControllerBase ctrl, string message)
            => ctrl.StatusCode(500, new { success = false, message });
    }
}
